import {
  Board,
  BoardFunction,
  // checkDiagonal,
  // checkHorizontal,
  // checkVertical,
  subBoard,
} from "./board.js";

interface Evaluation {
  [key: string]: number;
}

function scoreHorizontal(board: Board, winLength: number, playerId: string) {
  let count = 0;
  const n = board.length;
  const max = n - 2 + 1 / n; // adapt this to non squared boards
  for (const row of board) {
    for (let i = 0; i < row.length - winLength + 1; i++) {
      const slice = row.slice(i, i + winLength);
      const playerCount = slice.filter((cell) => cell === playerId).length;
      const bonus = playerCount / winLength;
      count += bonus ** 2;
    }
  }
  count /= max;
  return count;
}

function scoreVertical(board: Board, winLength: number, playerId: string) {
  let count = 0;
  const n = board.length;
  const max = n - 2 + 1 / n; // adapt this to non squared boards
  for (let i = 0; i < board[0].length; i++) {
    const column = board.map((row) => row[i]);
    for (let j = 0; j < column.length - winLength + 1; j++) {
      const slice = column.slice(j, j + winLength);
      const playerCount = slice.filter((cell) => cell === playerId).length;
      const bonus = playerCount / winLength;
      count += bonus ** 2;
    }
  }
  count /= max;
  return count;
}

function scoreDiagonal(board: Board, winLength: number, playerId: string) {
  let count = 0;
  const n = board.length;
  const max = (((n - 1) / n) ** 2) * 4; // adapt this to non squared boards
  for (let i = 0; i < board.length - winLength + 1; i++) {
    for (let j = 0; j < board[i].length - winLength + 1; j++) {
      const slice = [];
      for (let k = 0; k < winLength; k++) {
        slice.push(board[i + k][j + k]);
      }
      const playerCount = slice.filter((cell) => cell === playerId).length;
      const bonus = playerCount / winLength;
      count += bonus ** 2;
    }
  }
  for (let i = 0; i < board.length - winLength + 1; i++) {
    for (let j = winLength - 1; j < board[i].length; j++) {
      const slice = [];
      for (let k = 0; k < winLength; k++) {
        slice.push(board[i + k][j - k]);
      }
      const playerCount = slice.filter((cell) => cell === playerId).length;
      const bonus = playerCount / winLength;
      count += bonus ** 2;
    }
  }
  count /= max
  return count;
}

function evaluate(board: Board, winLength: number): Evaluation {
  const scores: Evaluation = {};
  const players = new Set<string>(
    board.flatMap((row) => row.map((cell) => cell)).filter(Boolean) as string[]
  );

  for (const playerId of players) {
    scores[playerId] = 0;
    scores[playerId] += scoreHorizontal(board, winLength, playerId) * 0.3;
    scores[playerId] += scoreVertical(board, winLength, playerId) * 0.3;
    scores[playerId] += scoreDiagonal(board, winLength, playerId) * 0.3;
    scores[playerId] /= 0.9;
  }
  return scores;
}

export default evaluate;
