import { Board, BoardSize, BoardAction } from "./board.types.js";
import { ArrayUpdate } from "./common.types.js";
import { User } from "./user.types.js";

export interface History {
    player: string;
    action: BoardAction | null
}

export interface Player {
    name: string;
    userId: string;
    order: number;
}

export interface Room {
    id: string;
    players: Player[]
    ownerId: string;
    history: History[];
    size: BoardSize;
    winLength: number;
    turn: number;
    current: Board;
    winner: string | null;
    started: boolean;
    createdAt: number;
    startedAt: number | null;
}

export interface CreateRoom {
    owner: User;
    size: BoardSize;
    winLength: number;
}

export interface UpdateRoom {
    ownerId?: string;
    history?: ArrayUpdate<History>;
    players?: ArrayUpdate<Player>;
    turn?: number;
    current?: Board;
    winner?: string;
    started?: boolean;
    startedAt?: number;
}
