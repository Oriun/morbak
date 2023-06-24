import type { Socket, Server } from "socket.io";
import { randomName } from "./utils.js";
import { Events } from "./events/index.js";
import * as User from "./services/user.js";
import { recoverInGame } from "./services/game.js";

function handleUser(io: Server) {
  return function (socket: Socket) {
    let user = User.create({
      name: randomName(),
      socketId: socket.id,
    });

    socket.emit("user", JSON.stringify(user));

    socket.on("recover", (id: string) => {
      try {
        const userFound = User.findUnique(id);
        if (!userFound) {
          socket.emit("recover", "not-found");
          return;
        }
        const oldSocket = userFound.socketId;
        console.log({ userFound });
        user = User.update(userFound.id, {
          socketId: socket.id,
        });
        recoverInGame(socket, oldSocket)
        console.log({ user });
        socket.emit("recover", JSON.stringify(user));
        user.currentRoom && socket.join(user.currentRoom);
      } catch (e) {
        console.log(e);
        socket.emit("recover", "error");
      }
    });

    for (const event in Events) {
      socket.on(event, (data: string) => {
        Events[event](socket, io, user.id, data).catch((e) => {
          socket.emit(event, "error");
          console.log("error", e);
        });
      });
    }
    socket.onAny((event, ...data) => {
      console.log("in", { event, data });
    });
    socket.onAnyOutgoing((event, ...data) => {
      console.log("out",{ event, data });
    });
  };
}

export default handleUser;
