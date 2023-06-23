import type { Socket } from "socket.io";
import { randomName } from "./utils.js";
import { Events } from "./events/index.js";
import * as User from "./services/user.js";

function handleUser(socket: Socket) {
  let user = User.create({
    name: randomName(),
    socketId: socket.id,
  });

  socket.emit("user", JSON.stringify(user));

  socket.on("recover", (id: string) => {
    const userFound = User.findUnique(id);
    if (!userFound) {
      socket.emit("recover", "not-found");
      return;
    }
    console.log({ userFound })
    user = User.update(userFound.id, {
      socketId: socket.id,
    });
    console.log({ user })
    socket.emit("recover", JSON.stringify(user));
  });

  for (const event in Events) {
    socket.on(event, (data: string) => {
      console.log({ event, data });
      Events[event](socket, user.id, data).catch((e) => {
        socket.emit(event, "error");
        console.log("error", e);
      });
    });
  }
  socket.onAny((event, ...data) => {
    console.log({ event, data });
  });
}

export default handleUser;
