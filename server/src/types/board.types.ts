import { Socket } from "socket.io";
import { User } from "./user.types.js";

export type Board = ({ playerId: string; image: string } | null)[][];

export type BoardSize = [number, number];

export interface BoardAction {
  row: number;
  col: number;
  playerId: string;
  image: string;
}

export type Move = [BoardAction|null, Socket, User]