import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Server, Socket } from "socket.io";
import { instantiate } from "../services/game.js";

export async function start(socket: Socket, io: Server, userId: string) {
    const user = User.findUnique(userId);
    if (!user) {
        socket.emit("start", "user-not-found")
        return;
    }

    if (!user.currentRoom) {
        socket.emit("start", "not-joined")
        return;
    }

    let room = Room.findUnique(user.currentRoom);
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


    room = Room.update(room.id, {
        started: true,
        startedAt: Date.now(),
    })

    socket.emit("start", "success");
    
    instantiate(room, io);
    socket.emit("game-started", JSON.stringify(room));
    socket.to(room.id).emit("game-started", JSON.stringify(room));
}