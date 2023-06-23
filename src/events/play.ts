import * as User from "../services/user.js";
import * as Room from "../services/rooms.js";
import type { Socket } from "socket.io";

export async function play(socket: Socket, userId: string, move: string) {
  const user = User.findUnique(userId);
  if (!user || !user.currentRoom) return;
  const room = Room.findUnique(user.currentRoom);
  console.log(room);
}
