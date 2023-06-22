import { io } from "socket.io-client"
type WSMessage = {
    type: string;
    data: unknown;
};
type Listener<T = unknown> = (data: T) => void;
const listeners: Record<string, (Listener<unknown> | undefined)[]> = {};

const socket = io()

export const send = (data: WSMessage) => {
    socket.emit(JSON.stringify(data));
};

export const register = <T = unknown>(type: string, listener: Listener<T>) => {
    listeners[type] ??= [];
    const index = listeners[type].push(listener as Listener<unknown>) - 1;
    return () => {
        delete listeners[type][index];
    };
};

export const ask =
    <T = unknown, S = unknown>(type: string) =>
        async (args?: T) => {
            let cleanUp: () => void = () => { };
            const data = await new Promise<S>(async (r) => {
                cleanUp = register(type, r);
                await send({
                    type,
                    data: args
                });
            });
            cleanUp();
            return data;
        };

export default socket;
