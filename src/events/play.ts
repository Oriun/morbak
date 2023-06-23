import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Socket } from "socket.io";

export async function play(socket: Socket, userId: string, move: string) {
  console.log(Room.findUnique(userId));
}
