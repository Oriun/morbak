import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Socket } from "socket.io";
import { Player } from "../types/room.types.js";

export async function kick(socket: Socket, userId: string, kickUserId: string) {
    const user = User.findUnique(userId);
    if (!user) {
        socket.emit("kick", "user-not-found")
        return;
    }

    if (!user.currentRoom) {
        socket.emit("kick", "not-joined")
        return;
    }

    const room = Room.findUnique(user.currentRoom);
    if (!room) {
        socket.emit("kick", "room-not-found")
        return;
    }
    if (room.ownerId !== user.id) {
        socket.emit("kick", "not-owner")
        return;
    }
    const kickUser = User.findUnique(kickUserId);
    if (!kickUser) {
        socket.emit("kick", "kick-user-not-found")
        return;
    }
    if (kickUser.currentRoom !== user.currentRoom) {
        socket.emit("kick", "kick-user-not-joined")
        return;
    }


    Room.update(room.id, {
        players: {
            delete: (player: Player) => player.userId === kickUser.id,
        }
    })

    User.update(kickUser.id, {
        currentRoom: null,
    })

    socket.emit("kick", "success");
    socket.broadcast.to(room.id).emit("user-kicked", JSON.stringify(kickUser));

}