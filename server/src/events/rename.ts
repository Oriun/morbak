import * as User from "../services/user.js";
import type { Server, Socket } from "socket.io";

export async function rename(socket: Socket, io: Server, userId: string, payload: string) {
  const user = User.update(userId, JSON.parse(payload));
  socket.emit("rename", "success");
  if (user.currentRoom) {
    socket.to(user.currentRoom).emit("user-update", JSON.stringify(user));
  }
}
