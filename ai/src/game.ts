import { Board, BoardAction } from "./board.js";

export function getCurrentPlayer(history: (BoardAction|null)[], players: string[]) {
  return players[history.length % players.length];
}

export function getAvailableMoves(
  board: Board,
  winLength: number,
  history: (BoardAction|null)[]
) {
  const moves: Omit<BoardAction, "playerId">[] = [];
  const lockedMoves = history.slice(-winLength).filter(Boolean) as BoardAction[];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const isLocked = lockedMoves.some(
        (move) => move.row === row && move.col === col
      );
      if (!isLocked) {
        moves.push({ row, col });
      }
    }
  }
  return moves;
}

export function checkWin(board: Board, winLength: number): string | null {
  /**
   * ROW CHECK
   */
  for (const row of board) {
    for (let i = 0; i < row.length - winLength + 1; i++) {
      const slice = row.slice(i, i + winLength);
      if (slice.every((cell) => cell === slice[0])) {
        return slice[0];
      }
    }
  }

  /**
   * COLUMN CHECK
   */

  for (let i = 0; i < board[0].length; i++) {
    const column = board.map((row) => row[i]);
    for (let j = 0; j < column.length - winLength + 1; j++) {
      const slice = column.slice(j, j + winLength);
      if (slice.every((cell) => cell === slice[0])) {
        return slice[0];
      }
    }
  }

  /**
   * DIAGONAL CHECK
   */
  for (let i = 0; i < board.length - winLength + 1; i++) {
    for (let j = 0; j < board[i].length - winLength + 1; j++) {
      const slice: Board[0] = [];
      for (let k = 0; k < winLength; k++) {
        slice.push(board[i + k][j + k]);
      }
      if (slice.every((cell) => cell === slice[0])) {
        return slice[0];
      }
    }
  }
  for (let i = 0; i < board.length - winLength + 1; i++) {
    for (let j = winLength - 1; j < board[i].length; j++) {
      const slice: Board[0] = [];
      for (let k = 0; k < winLength; k++) {
        slice.push(board[i + k][j - k]);
      }
      if (slice.every((cell) => cell === slice[0])) {
        return slice[0];
      }
    }
  }

  /**
   * NO WINNER YET
   */

  return null;
}
