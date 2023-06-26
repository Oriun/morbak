import cors from "cors";
import express from "express";
import { createServer } from "http";
import { playInRoom } from "./src/client.js";

const app = express();
const server = createServer(app);

app.use(cors());

app.post("/join", (req, res) => {
  const id = req.query.id;
  if (typeof id === "string" && id.length === 8) {
    playInRoom(id);
    return res.send("ok");
  }
  res.send("ko");
});

server.listen(4001, () => {
  console.log("listening on *:4001");
});
