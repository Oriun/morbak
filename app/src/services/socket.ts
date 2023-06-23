import { io } from "socket.io-client";

type WSMessage = {
  type: string;
  data: string;
};

type Listener = (data?: string) => void;

const socket = io();

export function send({ type, data }: WSMessage) {
  socket.emit(type, data);
}

export function register(type: string, listener: Listener) {
  socket.on(type, listener);
  return () => {
    socket.off(type, listener);
  };
}

export function ask(type: string) {
  return async function (arg = "") {
    let cleanUp: () => void = () => {};
    const data = await new Promise<string | undefined>(async (r, j) => {
      cleanUp = register(type, (data) => {
        if (data === "error") {
          j(data);
        } else {
          r(data);
        }
      });
      send({
        type,
        data: arg,
      });
      setTimeout(() => {
        j("timeout");
        cleanUp();
      }, 5_000);
    });
    cleanUp();
    return data;
  };
}

export default socket;
