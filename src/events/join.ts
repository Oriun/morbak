import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Socket } from "socket.io";

export async function join(socket: Socket, userId: string, roomId: string) {
    let room = Room.findUnique(roomId);
    if (!room) {
        socket.emit("join", "not-found")
        return;
    }
    if (room.started) {
        socket.emit("join", "started")
        return;
    }
    await socket.join(roomId);
    socket.emit("join", "success");
    const user = User.update(userId, {
        currentRoom: roomId,
    })!
    room = Room.update(roomId, {
        players: {
            create: {
                userId: user.id,
                order: room.players.length,
            }
        },
    })

    socket.broadcast.to(roomId).emit("user-joined", JSON.stringify(user));
    socket.emit("users", JSON.stringify(room.players));
    socket.broadcast.to(roomId).emit("users", JSON.stringify(room.players));
}