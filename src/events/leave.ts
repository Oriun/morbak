import * as User from "../services/user.js"
import * as Room from "../services/rooms.js"
import type { Socket } from "socket.io";
import { Player } from "../types/room.types.js";

export async function leave(socket: Socket, userId: string) {
    const user = User.findUnique(userId);
    if (!user) {
        socket.emit("leave", "user-not-found")
        return;
    }

    if (!user.currentRoom) {
        socket.emit("leave", "not-joined")
        return;
    }

    const room = Room.findUnique(user.currentRoom);
    if (!room) {
        socket.emit("leave", "room-not-found")
        return;
    }

    Room.update(room.id, {
        players: {
            delete: (player: Player) => player.userId === user.id,
        }
    })
    if (!room.players.length) {
        Room.deleteRoom(room.id);
        socket.rooms.delete(room.id);
    } else if (room.ownerId === user.id) {
        Room.update(room.id, {
            ownerId: room.players[0].userId,
        })
    }

    
    User.update(userId, {
        currentRoom: null,
    })
    console.log("rooms", socket.rooms)
    socket.to(room.id).emit("user-left", JSON.stringify(user));
    await socket.leave(room.id);
    socket.emit("leave", "success");

}