import { instantiate } from "../services/game.js";
import * as Room from "../services/rooms.js";
import * as User from "../services/user.js";
import type { Socket } from "socket.io";

export async function test(socket: Socket, userId: string) {
  const room = Room.create({
    timer: 60,
    owner: User.findUnique(userId)!,
    size: [6, 6],
    winLength: 6,
  });

  instantiate(room);
}
