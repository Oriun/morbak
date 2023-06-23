import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Socket } from "socket.io";

export async function create(socket: Socket, userId: string, payload: string) {
    const user = User.findUnique(userId);
    if (!user) {
        socket.emit("create", "user-not-found")
        return;
    }
    if (user.currentRoom) {
        socket.emit("create", "already-joined")
        return;
    }
    const { size, winLength, timer } = JSON.parse(payload);
    const room = Room.create({
        owner: user,
        size,
        winLength,
        timer
    })
    await socket.join(room.id);
    socket.emit("create", "success");
    User.update(userId, {
        currentRoom: room.id,
    })
    socket.emit("join", "success");
}