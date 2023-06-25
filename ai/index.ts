import {
  BoardAction,
  createBoard,
  fillBoard,
  printBoard,
} from "./src/board.js";
import { playInRoom } from "./src/client.js";
import evaluate from "./src/evaluation.js";
import { minimax } from "./src/minimax.js";

console.log(
  "Implementing Minimax AI with Alpha-Beta Pruning and Iterative Deepening"
);
function testEvaluationFn() {
  const winLength = 4;
  const board = createBoard([4, 4]);

  fillBoard(board, [
    {
      row: 0,
      col: 0,
      playerId: "1",
    },
    {
      row: 1,
      col: 1,
      playerId: "2",
    },
    {
      row: 0,
      col: 1,
      playerId: "1",
    },
    {
      row: 2,
      col: 2,
      playerId: "2",
    },
    {
      row: 0,
      col: 2,
      playerId: "1",
    },
    {
      row: 0,
      col: 3,
      playerId: "2",
    },
    {
      row: 1,
      col: 3,
      playerId: "1",
    },
    {
      row: 3,
      col: 3,
      playerId: "2",
    },
    {
      row: 3,
      col: 2,
      playerId: "1",
    },
    {
      row: 2,
      col: 3,
      playerId: "2",
    },
  ]);

  printBoard(board);

  const scores = evaluate(board, winLength);

  console.log(scores);
}

// testEvaluationFn()

function testMinimax() {
  const winLength = 4;
  const board = createBoard([winLength, winLength]);
  const history: BoardAction[] = [
    {
      row: 0,
      col: 0,
      playerId: "1",
    },
    {
      row: 1,
      col: 1,
      playerId: "2",
    },
    {
      row: 0,
      col: 1,
      playerId: "1",
    },
    {
      row: 2,
      col: 2,
      playerId: "2",
    },
    {
      row: 0,
      col: 2,
      playerId: "1",
    },
    {
      row: 0,
      col: 3,
      playerId: "2",
    },
    {
      row: 1,
      col: 3,
      playerId: "1",
    },
    {
      row: 3,
      col: 3,
      playerId: "2",
    },
    {
      row: 3,
      col: 2,
      playerId: "1",
    },
    {
      row: 2,
      col: 3,
      playerId: "2",
    }
  ];
  fillBoard(board, history);

  console.log("starting board")
  printBoard(board);
  console.log("\n\nexplorign next moves")
  const [nextBoard,score, nextMove] = minimax(board, history, winLength, 1, "1", ["1", "2"]);
  console.log("\n\nbest next board")
  printBoard(nextBoard);
  console.log({score})
}

playInRoom("h127uLER")