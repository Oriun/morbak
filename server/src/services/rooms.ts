import { Room, CreateRoom, UpdateRoom } from "../types/room.types.js";
import { nanoid } from "nanoid";
import { arrayUpdate } from "../utils.js";
import { createBoard } from "./board.js";

const rooms: Map<string, Room> = new Map();


export function findMany(filter: (room: Room) => boolean) {
    return Array.from(rooms.values()).filter(filter);
}

export function findUnique(id: string) {
    return rooms.get(id);
}

export function create(roomPayload: CreateRoom) {
    const room: Room = {
        id: nanoid(8),
        players: [{
            userId: roomPayload.owner.id,
            order: 0,
        }],
        timer: roomPayload.timer,
        ownerId: roomPayload.owner.id,
        history: [],
        size: roomPayload.size,
        winLength: roomPayload.winLength,
        turn: 0,
        board: createBoard(roomPayload.size),
        winner: null,
        started: false,
        createdAt: Date.now(),
        startedAt: null,
    }
    rooms.set(room.id, room);
    return room;
}

export function deleteRoom(id: string) {
    rooms.delete(id);
}

export function deleteMany(filter: (room: Room) => boolean) {
    const toDelete = findMany(filter);
    toDelete.forEach(room => rooms.delete(room.id));
    return toDelete;
}

const SIMPLE_UPDATE = ["owner", "turn", "board", "winner", "started", "startedAt", "timer"] as const;
const ARRAY_UPDATE = ["history", "players"] as const;

export function update(id: string, roomPayload: UpdateRoom) {
    let room = findUnique(id);
    if (!room) throw new Error("Room not found");
    room = structuredClone(room);
    for (const property of SIMPLE_UPDATE) {
        if (roomPayload.hasOwnProperty(property)) {
            // @ts-ignore
            room[property] = roomPayload[property];
        }
    }
    for (const property of ARRAY_UPDATE) {
        if (roomPayload.hasOwnProperty(property)) {
            // @ts-ignore
            arrayUpdate(room[property], roomPayload[property]);
        }
    }
    rooms.set(id, room);
    return room;
}

export function updateMany(filter: (room: Room) => boolean, roomPayload: UpdateRoom) {
    const roomList = findMany(filter);
    for (const room of roomList) {
        update(room.id, roomPayload);
    }
    return roomList.length
}