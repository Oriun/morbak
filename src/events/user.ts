import * as User from "../services/user.js";
import type { Socket } from "socket.io";

export async function user(
  socket: Socket,
  userId: string,
  otherUserId: string
) {
  const user = User.findUnique(userId);
  if (!user) {
    socket.emit("user", "not-found");
    return;
  }
  const otherUser = User.findUnique(otherUserId);
  if (!otherUser) {
    socket.emit("user", "not-found");
    return;
  }
  socket.emit("user", JSON.stringify(otherUser));
}
