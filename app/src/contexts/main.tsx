import socket, { ask, send } from "@/services/socket";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type User = {
  id: string;
  avatar: string | null;
  name: string;
  currentRoom: string | null;
};
export type Room = {
  id: string;
  timer: number;
  size: string;
  winLength: number;
  players: {
    userId: string;
    order: number;
  }[];
  ownerId: string;
};
export type Game = {
  id: string;
};
export type Context = {
  user: User | null;
  users: User[];
  room: Room | null;
  game: Game | null;
  update: Dispatch<SetStateAction<Omit<Context, "update">>>;
};

const defaultContext: Omit<Context, "update"> = {
  user: null,
  users: [],
  room: null,
  game: null,
};
const MainContext = createContext<Context>({
  ...defaultContext,
  update: () => ({
    user: null,
    users: [],
    room: null,
    game: null,
  }),
});

export const Provider: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const fromStorage = sessionStorage.getItem("context");
  const [state, update] = useState<Omit<Context, "update">>(
    fromStorage ? JSON.parse(fromStorage) : defaultContext
  );

  useEffect(() => {
    console.log({ state });
    sessionStorage.setItem("context", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const morbakID = sessionStorage.getItem("morbakID");

    console.log("morbakID", morbakID);

    (async () => {
      if (morbakID) {
        const recovery = await ask("recover")(morbakID);
        if (recovery === "not-found") {
          sessionStorage.removeItem("morbakID");
        }
        update(defaultContext);
      }
      const data = await ask("me")();
      console.log("me", data);
      if (!data || data === "not-found") return;
      const user = JSON.parse(data);
      update((state) => ({
        ...state,
        user,
      }));
      sessionStorage.setItem("morbakID", user.id);
    })();
  }, []);

  socket

  return (
    <MainContext.Provider value={{ ...state, update }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  return useContext(MainContext);
};

export default MainContext;
