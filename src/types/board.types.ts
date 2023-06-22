export type Board = (string | null)[][]

export type BoardSize = [number, number];

export interface BoardAction {
    row: number;
    col: number;
    symbol: string;
}