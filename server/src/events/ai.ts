import * as User from "../services/user.js";
import * as Room from "../services/rooms.js";
import type { Server, Socket } from "socket.io";

export async function ai(socket: Socket, io: Server, userId: string) {
  const user = User.findUnique(userId);
  if (!user) {
    socket.emit("leave", "user-not-found");
    return;
  }

  if (!user.currentRoom) {
    socket.emit("leave", "not-joined");
    return;
  }

  const room = Room.findUnique(user.currentRoom);
  if (!room) {
    socket.emit("leave", "room-not-found");
    return;
  }

  try {
    const res = await fetch("http://ai:4001/join?id=" + room.id);
    if (!res.ok) throw new Error("ai not found");
    const txt = await res.text();
    if (txt !== "ok") throw new Error("ai not found");
    socket.emit("ai", "success");
  } catch (e) {
    console.log(e);
    socket.emit("ai", (e as Error).message);
  }
}
