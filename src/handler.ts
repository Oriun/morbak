import type { Socket } from "socket.io";
import { randomName } from "./utils.js";
import { Events } from "./events/index.js";
import * as User from "./services/user.js"

function handleUser(socket: Socket) {

    let user = User.create({
        name: randomName(),
        socketId: socket.id,
    });

    socket.emit("user", JSON.stringify(user));

    socket.on("recover", (id: string) => {
        const userFound = User.findUnique(id);
        if (!userFound) {
            socket.emit("recover", "not-found");
            return;
        }
        user = User.update(user.id, {
            socketId: socket.id,
        })
        socket.emit("recover", JSON.stringify(user));
    })

    for (const event in Events) {
        socket.on(event, (data: string) => {
            Events[event](socket, user.id, data);
        })
    }
}


export default handleUser;