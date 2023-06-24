import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Server, Socket } from "socket.io";

export async function create(socket: Socket, io: Server, userId: string, payload: string) {
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
    User.update(userId, {
        currentRoom: room.id,
    })
    socket.emit("create", "success");
}