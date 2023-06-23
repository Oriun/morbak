import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Socket } from "socket.io";

export async function room(socket: Socket, userId: string) {
    const user = User.findUnique(userId);
    if (!user) {
        socket.emit("room", "user-not-found")
        return;
    }
    if (!user.currentRoom) {
        socket.emit("room", "not-joined")
        return;
    }
    const room = Room.findUnique(user.currentRoom);

    socket.emit("room", JSON.stringify(room));
}