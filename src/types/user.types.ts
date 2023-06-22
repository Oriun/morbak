export interface User {
    id: string;
    name: string;
    currentRoom: string | null;
    socketId: string;
    createdAt: number;
}

export interface CreateUser {
    name: string;
    socketId: string;
}

export interface UpdateUser {
    name?: string;
    currentRoom?: string | null;
    socketId?: string;
}