import { Room as RoomType } from "../types/room.types.js";
import * as Room from "../services/rooms.js";
import * as User from "../services/user.js";
import { checkWin, fillBoard } from "./board.js";
import type { Server, Socket } from "socket.io";
import { Move } from "../types/board.types.js";
import { Subject, Subscription } from "rxjs";

// for recovery
const captureMap = new Map<string, (socket: Socket) => void>();

export function recoverInGame(socket: Socket, oldSocketId: string) {
  console.log("recoverInGame", { oldSocketId });
  const capture = captureMap.get(oldSocketId);
  if (!capture) return;
  capture(socket);
  captureMap.delete(oldSocketId);
  captureMap.set(socket.id, capture);
  console.log("recovered in game");
}

export async function instantiate(_room: RoomType, io: Server) {
  console.log("instantiate", { _room });
  let room = Room.findUnique(_room.id)!;
  const socketIds = io.sockets.adapter.rooms.get(room.id);
  if (!socketIds) {
    return;
  }
  const sockets = Array.from(socketIds)
    .map((id) => io.sockets.sockets.get(id))
    .filter(Boolean) as Socket[];

  const { board, winLength } = room;

  const moves$ = new Subject<Move>();

  room.players.sort((a, b) => a.order - b.order);

  function captureMove(socket: Socket) {
    const [user] = User.findMany((user) => user.socketId === socket.id);
    return function (data: string) {
      console.log("captureMove", { data });
      if (!user) return;
      const { row, col } = JSON.parse(data);
      moves$.next([
        {
          row,
          col,
          playerId: user.id,
          image: user.avatar!,
        },
        socket,
        user,
      ] as Move);
    };
  }

  let notifyWinner: (id: string) => void;

  const winnerNotificationPromise = new Promise<string>((r) => {
    notifyWinner = r;
  });

  for (const socket of sockets) {
    console.log("on play");
    socket.on("play", captureMove(socket));
    socket.emit("game-started", JSON.stringify(room));
    winnerNotificationPromise.then((id) => {
      socket.emit("game-ended", id);
      captureMap.delete(socket.id);
    });
    captureMap.set(socket.id, (sock) => {
      sock.on("play", captureMove(sock));
      winnerNotificationPromise.then((id) => {
        sock.emit("game-ended", id);
        captureMap.delete(sock.id);
      });
    });
  }

  while (!checkWin(board, winLength)) {
    let subscription: Subscription;
    await new Promise<void>((r) => {
      console.log("awaiting move");
      subscription = moves$.subscribe(([action, socket, user]) => {
        console.log("move", { action, user });
        const currentPlayer = getCurrentPlayer(room);

        console.log({ currentPlayer, playerId: action.playerId });
        if (action.playerId !== currentPlayer) {
          return socket.emit("play", "not-your-turn");
        }

        const { row, col } = action;
        const lastMoves = room.history.slice(-room.winLength);
        if (lastMoves.find((move) => move?.row === row && move?.col === col)) {
          return socket.emit("play", "too-early");
        }

        console.log("move accepted");

        fillBoard(board, [action]);

        Object.assign(
          room,
          Room.update(room.id, {
            turn: room.turn + 1,
            history: {
              create: action,
            },
            board,
          })
        );

        socket.emit("play", "success");
        socket.to(room.id).emit("room-update", JSON.stringify(room));
        socket.emit("room-update", JSON.stringify(room));

        r();
      });
    });
    subscription!.unsubscribe();
  }

  const winner = getLastPlayer(room)
  console.log("winner is", winner);
  room.players.forEach((player) => {
    User.update(player.userId, {
      currentRoom: null,
    });
  });
  Room.deleteRoom(room.id);
  notifyWinner!(winner);
}

function getCurrentPlayer(room: RoomType) {
  const player = room.players.at(room.turn % room.players.length)!;
  return player.userId;
}

function getLastPlayer(room: RoomType) {
  const player = room.players.at((room.turn - 1) % room.players.length)!;
  return player.userId;
}
