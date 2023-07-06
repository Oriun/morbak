export type Board = (string | null)[][];

export type BoardSize = [number, number];

export type BoardFunction = (
  board: Board,
  winLength: number,
  playerId: string,
  partialCount: number
) => number;

export interface BoardAction {
  row: number;
  col: number;
  playerId: string;
}

export function createBoard(size: BoardSize) {
  return Array.from({ length: size[0] }, () =>
    Array.from({ length: size[1] }, () => null)
  );
}


export function fillBoard(board: Board, actions: (BoardAction | null)[]) {
  const validActions = actions.filter((action): action is BoardAction => !!action);
  for (const { row, col, playerId } of validActions) {
    board[row][col] = playerId;
  }
}

export function printBoard(board: Board) {
  console.log("-----------------");
  console.log(
    "| " +
      board
        .map((row) => row.map((cell) => cell ?? " ").join(" | "))
        .join(" |\n| ") +
      " |"
  );
  console.log("-----------------");
}

export function subBoard(
  board: Board,
  row: number,
  col: number,
  rowSize: number,
  colSize: number
) {
  return board
    .slice(row, row + rowSize)
    .map((row) => row.slice(col, col + colSize));
}
