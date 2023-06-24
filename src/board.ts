import { Board, BoardAction, BoardSize } from "./types/board.types.js";

export function createBoard(size: BoardSize) {
  return Array.from({ length: size[0] }, () =>
    Array.from({ length: size[1] }, () => null)
  );
}

function checkHorizontal(board: Board, winLength: number) {
  for(const row of board) {
    for(let i = 0; i < row.length - winLength + 1; i++) {
      const slice = row.slice(i, i + winLength);
      if(slice.includes(null)) {
        continue;
      }
      if(slice.every(cell => cell?.playerId === slice[0]?.playerId)) {
        return true;
      }
    }
  }
  return false;
}
function checkVertical(board: Board, winLength: number) {
  for(let i = 0; i < board[0].length; i++) {
    const column =  board.map(row => row[i])
    for(let j = 0; j < column.length - winLength + 1; j++) {
      const slice = column.slice(j, j + winLength);
      if(slice.includes(null)) {
        continue;
      }
      if(slice.every(cell => cell?.playerId === slice[0]?.playerId)) {
        return true;
      }
    }
  }
  return false;
}
function checkDiagonal(board: Board, winLength: number) {
  for (let i = 0; i < board.length - winLength + 1; i++) {
    for (let j = 0; j < board[0].length - winLength + 1; j++) {
      let current = board[i][j];
      let count = 0;
      for (let k = 0; k < winLength; k++) {
        const cell = board[i + k][j + k];
        if (cell && cell?.playerId === current?.playerId) {
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
        if (cell && cell?.playerId === current?.playerId) {
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

export function fillBoard(board: Board, actions: BoardAction[]) {
  for (const { row, col, ...action } of actions) {
    board[row][col] = action;
  }
}
