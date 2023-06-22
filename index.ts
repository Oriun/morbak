import Server from "./src/server.js";
import { Server as WsServer } from "socket.io";
import handleUser from "./src/handler.js";

const io = new WsServer(Server);

io.on("connection", handleUser);

Server.listen(4000, "0.0.0.0", () => {
  console.log("listening on *:4000");
});
