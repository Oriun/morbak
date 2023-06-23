import * as User from "../services/user.js";
import type { Socket } from "socket.io";

export async function me(socket: Socket, userId: string, name: string) {
  const user = User.findUnique(userId);
  socket.emit("me", JSON.stringify(user));
  console.log("emit me")
}
