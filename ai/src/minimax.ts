import { Board, BoardAction, fillBoard, printBoard } from "./board.js";
import evaluate from "./evaluation.js";
import { checkWin, getAvailableMoves, getCurrentPlayer } from "./game.js";

export function minimax(
  board: Board,
  history: (BoardAction | null)[],
  winLength: number,
  depth: number,
  playerId: string,
  players: string[]
): [Board, number, BoardAction | null] {
  const currentPlayer = getCurrentPlayer(history, players);
  const isMaximizing = playerId === currentPlayer;

  const winner = checkWin(board, winLength);
  if (winner) {
    const isWinner = winner === playerId ? 1 : -2;
    if (isMaximizing) {
      return [board, isWinner, null];
    } else {
      return [board, isWinner, null];
    }
  }

  if (depth === 0) {
    const scores = evaluate(board, winLength);
    const maxScore = Math.max(...Object.values(scores));
    const playerScore = scores[playerId];
    if (playerScore === maxScore) {
      return [board, maxScore, null];
    }
    return [board, (playerScore - maxScore) * 2, null];
  }

  let bestBoard = board;
  let bestMove: BoardAction | null = null;
  let maxEval = isMaximizing ? -Infinity : Infinity;
  const availableMoves = getAvailableMoves(board, winLength, history);
  for (let move of availableMoves) {
    const newBoard = structuredClone(board);
    const ownedMove = { ...move, playerId: currentPlayer };
    fillBoard(newBoard, [ownedMove]);
    const [_, score] = minimax(
      newBoard,
      [...history, ownedMove],
      winLength,
      depth - 1,
      playerId,
      players
    );
    if (isMaximizing) {
      if (score > maxEval) {
        maxEval = score;
        bestBoard = newBoard;
        bestMove = ownedMove;
      }
    } else {
      if (score < maxEval) {
        maxEval = score;
        bestBoard = newBoard;
        bestMove = ownedMove;
      }
    }
  }
  return [bestBoard, maxEval, bestMove];
}
