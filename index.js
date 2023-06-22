window.onError(err => alert (err.message))
// import { io } from "https://cdn.socket.io/4.4.1/socket.socket.esm.min.js";

const socket = io("ws://10.73.190.162:25565");
socket.emit("join", "game");
const size = 4;
const history = [];
const lastActionsSize = 3;
const lastActions = Array.from({ length: lastActionsSize }, () => null);
const boardElement = document.getElementById("board");
const playerElement = document.getElementById("player");
const timerElement = document.getElementById("timer");
const COLORS = ["green", "orange", "red", "black"];
const TIMEOUT = 5_000;
let currentTimeout = 0;
let currentInterval = 0;
const board = Array.from({ length: size }, () =>
  Array.from({ length: size }, () => null)
);

function pushLastAction(action) {
  lastActions.push(action);
  if (lastActions.length > lastActionsSize) {
    lastActions.shift();
  }
}

const players = ["♤", "♢", "♧", "♡"];
let me = "";

function printMe() {
  playerElement.textContent = `Current player : ${getCurrentPlayer()}; Me: ${me}`;
}

socket.once("nbPlayer", (player) => {
  console.log(player);
  me = players[parseInt(player) - 1];
  printMe();
  //   alert(`You are ${me}`);
  renderBoard();
});

function getCurrentPlayer() {
  return players[history.length % players.length];
}

function broadCast(rowIndex, cellIndex) {
  socket.emit("play", JSON.stringify({ rowIndex, cellIndex, p: me }));
}

function checkWinner() {
  const currentPlayer = getCurrentPlayer();
  const rows = board.find((row) => row.every((cell) => cell === currentPlayer));
  if (rows) {
    return alert(`${currentPlayer} won 1`);
  }
  const columns = board[0].find((_, index) => {
    return board.every((row) => row[index] === currentPlayer);
  });
  if (columns) {
    return alert(`${currentPlayer} won 2`);
  }
  if (
    board[0][0] === currentPlayer &&
    board[1][1] === currentPlayer &&
    board[2][2] === currentPlayer &&
    board[3][3] === currentPlayer
  ) {
    return alert(`${currentPlayer} won 3`);
  }
  if (
    board[0][3] === currentPlayer &&
    board[1][2] === currentPlayer &&
    board[2][1] === currentPlayer &&
    board[3][0] === currentPlayer
  ) {
    return alert(`${currentPlayer} won 4`);
  }
}

function play(rowIndex, cellIndex) {
  console.log("play");
  const currentPlayer = getCurrentPlayer();
  const key = `${rowIndex}-${cellIndex}`;
  if (lastActions.includes(key)) {
    alert("Invalid move " + key + "  " + lastActions.join(" "));
    return;
  }
  clearTimeout(currentTimeout);
  clearTimeout(currentInterval);
  currentPlayer === me && broadCast(rowIndex, cellIndex);
  pushLastAction(key);
  board[rowIndex][cellIndex] = currentPlayer;
  history.push({ rowIndex, cellIndex, currentPlayer });
  renderBoard();
  timeoutPlay();
  setTimeout(() => {
    checkWinner();
    printMe();
  }, 200);
}

function timeoutPlay() {
  //   let t = TIMEOUT;
  //   currentInterval = setInterval(() => {
  //     t -= 1_000;
  //     timerElement.textContent = t / 1_000;
  //   }, 1_000);
  //   currentTimeout = setTimeout(() => {
  //     alert("Timeout");
  //     play(-1, -1);
  //   }, TIMEOUT);
}

socket.on("play", (action) => {
  console.log(action);
  const { rowIndex, cellIndex, p } = JSON.parse(action);
  if (p === me) return;
  play(rowIndex, cellIndex);
});

function renderBoard() {
  const currentPlayer = getCurrentPlayer();
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const index = rowIndex * size + cellIndex;
      let cellElement = boardElement.querySelector(`#cell-${index}`);
      if (!cellElement) {
        console.log("create cell");
        const div = document.createElement("div");
        div.id = `cell-${index}`;
        div.className = "cell";
        cellElement = div;
        boardElement.appendChild(div);
      }
      cellElement.textContent = cell;
      if (!cell) {
        cellElement.style.color = "white";
      } else {
        cellElement.style.color = COLORS.at(
          lastActions.findIndex(
            (action) => action === `${rowIndex}-${cellIndex}`
          )
        );
      }
      if (currentPlayer === me) {
        cellElement.onclick = () => {
          play(rowIndex, cellIndex);
        };
      }
    });
  });
}

printMe();
renderBoard();
timeoutPlay();
