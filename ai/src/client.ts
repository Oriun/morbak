import { io, Socket } from "socket.io-client";
import { Board, BoardSize, printBoard } from "./board.js";
import { minimax } from "./minimax.js";
import { getCurrentPlayer } from "./game.js";

export async function waitForEvent(
  socket: Socket,
  event: string,
  timeout = 30_000
) {
  return new Promise<string>((resolve, reject) => {
    if (timeout) {
      setTimeout(() => {
        reject(new Error(`Timeout waiting for ${event}`));
      }, timeout);
    }
    socket.once(event, (data: string) => {
      // console.log(`Received ${event}: ${data}`);
      resolve(data);
    });
  });
}

type RealBoardAction = {
  row: number;
  col: number;
  playerId: string;
  image: string;
};
type Player = {
  name: string;
  userId: string;
};

type RealBoard = (RealBoardAction | null)[][];

export interface Room {
  id: string;
  timer: number;
  players: Player[];
  ownerId: string;
  history: (RealBoardAction | null)[];
  size: BoardSize;
  winLength: number;
  turn: number;
  board: RealBoard;
  winner: string | null;
  started: boolean;
  createdAt: number;
  startedAt: number | null;
}

function fromRealBoard(board: RealBoard): Board {
  return board.map((row) => row.map((cell) => cell?.playerId ?? null));
}

export async function playInRoom(roomId: string) {
  const socket = io("https://morbak.oriun.fr");

  // socket.onAny((event, ...args) => {
  //   console.log(`\n[SOCKET] Received ${event}: ${args}\n`);
  //   });

  socket.emit("join", roomId);

  let ended = false;

  waitForEvent(socket, "game-ended", 0).then(() => {
    ended = true;
  });

  const [_me] = await Promise.all([
    waitForEvent(socket, "me"),
    socket.emit("me"),
  ]);

  const { id } = JSON.parse(_me) as { id: string };

  console.log("my id", id);

  console.log("waiting for game start");

  await waitForEvent(socket, "game-started", 0);

  while (!ended) {
    console.log("waiting for room update");

    let room: Room;
    do {
      const data = await waitForEvent(socket, "room-update", 0);
      room = JSON.parse(data) as Room;
      if (ended) return;
    } while (
      getCurrentPlayer(
        room.history,
        room.players.map((p) => p.userId)
      ) !== id
    );
    
    console.log("room got updated");

    const board = fromRealBoard(room.board);

    printBoard(board);

    const [nextBoard, score, nextMove] = minimax(
      board,
      room.history,
      room.winLength,
      5,
      id,
      room.players.map((p) => p.userId)
    );

    console.log("score", score);
    printBoard(nextBoard);

    console.log("next move", nextMove);
    if (nextMove === null) {
      break;
    }

    console.log("playing");
    await Promise.all([
      waitForEvent(socket, "room-update"),
      socket.emit(
        "play",
        JSON.stringify({ row: nextMove.row, col: nextMove.col })
      ),
    ]);
  }
  console.log("game ended");
}
