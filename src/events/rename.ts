import * as User from "../services/user.js";
import type { Socket } from "socket.io";

export async function rename(socket: Socket, userId: string, payload: string) {
  const user = User.update(userId, JSON.parse(payload));
  socket.emit("rename", "success");
  if (user.currentRoom) {
    socket.broadcast.to(user.currentRoom).emit("user:rename", user);
  }
}
