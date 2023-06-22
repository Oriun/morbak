import { Board, BoardAction, BoardSize } from "./types/board.types.js";

export function createBoard(size: BoardSize) {
    return Array.from({ length: size[0] }, () => Array.from({ length: size[1] }, () => null));
}

function checkHorizontal(board: Board, winLength: number) {
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        let current = row[0];
        let count = 0;
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            if (cell === current) {
                count++;
            } else {
                current = cell;
                count = 1;
            }
            if (count === winLength && current !== null) {
                return current;
            }
        }
    }
    return null;
}
function checkVertical(board: Board, winLength: number) {
    for (let i = 0; i < board[0].length; i++) {
        let current = board[0][i];
        let count = 0;
        for (let j = 0; j < board.length; j++) {
            const cell = board[j][i];
            if (cell === current) {
                count++;
            } else {
                current = cell;
                count = 1;
            }
            if (count === winLength && current !== null) {
                return current;
            }
        }
    }
    return null;
}
function checkDiagonal(board: Board, winLength: number) {
    for (let i = 0; i < board.length - winLength + 1; i++) {
        for (let j = 0; j < board[0].length - winLength + 1; j++) {
            let current = board[i][j];
            let count = 0;
            for (let k = 0; k < winLength; k++) {
                const cell = board[i + k][j + k];
                if (cell === current) {
                    count++;
                } else {
                    current = cell;
                    count = 1;
                }
                if (count === winLength && current !== null) {
                    return current;
                }
            }
        }
    }
    for (let i = 0; i < board.length - winLength + 1; i++) {
        for (let j = winLength - 1; j < board[0].length; j++) {
            let current = board[i][j];
            let count = 0;
            for (let k = 0; k < winLength; k++) {
                const cell = board[i + k][j - k];
                if (cell === current) {
                    count++;
                } else {
                    current = cell;
                    count = 1;
                }
                if (count === winLength && current !== null) {
                    return current;
                }
            }
        }
    }
    return null;
}

export function checkWin(board: Board, winLength: number) {
    if (checkHorizontal(board, winLength)) return true;
    if (checkVertical(board, winLength)) return true;
    if (checkDiagonal(board, winLength)) return true;
    return false;
}

export function fillRoom(board: Board, actions: BoardAction[]) {
    for (const action of actions) {
        board[action.row][action.col] = action.symbol;
    }
}