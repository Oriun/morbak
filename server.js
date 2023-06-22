const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  console.log("get /");
  res.sendFile(__dirname + "/index.html");
});
app.get("/index.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript")
  res.sendFile(__dirname + "/index.js");
});

app.use(cors());

const players = [false, false, false, false];
io.on("connection", (socket) => {
  console.log("a user connected");
  const index = players.findIndex((p) => p === false);
  socket.emit("nbPlayer", index);
  players[index] = true;

  socket.on("disconnect", () => {
    console.log("user disconnected");
    players[index] = false;
  });

  socket.on("play", (msg) => {
    socket.broadcast.emit("play", msg);
  });
});

server.listen(4000, "0.0.0.0", () => {
  console.log("listening on *:4000");
});
