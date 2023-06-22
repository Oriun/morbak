import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Socket } from "socket.io";
import { Player } from "../types/room.types.js";
import { instantiate } from "../services/game.js";

export async function leave(socket: Socket, userId: string) {
    const user = User.findUnique(userId);
    if (!user) {
        socket.emit("start", "user-not-found")
        return;
    }

    if (!user.currentRoom) {
        socket.emit("start", "not-joined")
        return;
    }

    const room = Room.findUnique(user.currentRoom);
    if (!room) {
        socket.emit("start", "room-not-found")
        return;
    }
    if (room.ownerId !== user.id) {
        socket.emit("start", "not-owner")
        return;
    }
    if (room.started) {
        socket.emit("start", "already-started")
        return;
    }


    Room.update(room.id, {
        started: true,
        startedAt: Date.now(),
    })

    socket.emit("start", "success");
    socket.broadcast.to(room.id).emit("game-started", JSON.stringify(room));

    instantiate(room);
}