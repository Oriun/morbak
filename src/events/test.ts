import { instantiate } from "../services/game.js";
import * as Room from "../services/rooms.js";
import * as User from "../services/user.js";
import type { Server, Socket } from "socket.io";

export async function test(socket: Socket, io: Server, userId: string) {
  const room = Room.create({
    timer: 60,
    owner: User.findUnique(userId)!,
    size: [6, 6],
    winLength: 6,
  });
  socket.join(room.id);

  instantiate(room, io);
}
