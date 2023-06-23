import { nanoid } from "nanoid";
import { CreateUser, UpdateUser, User } from "../types/user.types.js";

const users: Map<string, User> = new Map();


export function findMany(filter: (room: User) => boolean) {
    return Array.from(users.values()).filter(filter);
}

export function findUnique(id: string) {
    return users.get(id);
}

export function create(roomPayload: CreateUser) {
    const id = nanoid()
    const user: User = {
        id,
        createdAt: Date.now(),
        currentRoom: null,
        name: roomPayload.name,
        avatar: "https://api.dicebear.com/6.x/bottts-neutral/svg?seed="+id,
        socketId: roomPayload.socketId,
    }
    users.set(user.id, user);
    return user;
}

export function deleteUser(id: string) {
    users.delete(id);
}

export function deleteMany(filter: (user: User) => boolean) {
    const toDelete = findMany(filter);
    toDelete.forEach(user => users.delete(user.id));
    return toDelete;
}


export function update(id: string, userPayload: UpdateUser) {
    const user = findUnique(id);
    if (!user) throw new Error("User not found");
    const updatedUser = {
        ...user,
        ...userPayload
    }
    users.set(id, updatedUser);
    return user;
}
export function updateMany(filter: (room: User) => boolean, userPayload: UpdateUser) {
    const userList = findMany(filter);
    for (const user of userList) {
        update(user.id, userPayload);
    }
    return userList.length
}