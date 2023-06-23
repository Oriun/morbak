import * as User from "../services/user.js";
import type { Socket } from "socket.io";

export async function rename(socket: Socket, userId: string, name: string) {
  const user = User.update(userId, { name });
  socket.emit("rename", "success");
  if (user.currentRoom) {
    socket.to(user.currentRoom).emit("user:rename", user);
  }
}
