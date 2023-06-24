import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Server, Socket } from "socket.io";

export async function join(socket: Socket, io: Server, userId: string, roomId: string) {
    let room = Room.findUnique(roomId);
    if (!room) {
        socket.emit("join", "not-found")
        return;
    }
    if (room.started) {
        socket.emit("join", "already-started")
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

    socket.to(roomId).emit("user-joined", JSON.stringify(user));
}