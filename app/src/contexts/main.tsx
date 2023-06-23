import socket, { ask, send } from "@/services/socket";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "@chakra-ui/react";
import { getMyself, getUserById, recover } from "@/services/functions";
import { userJoined, userLeft, userUpdated } from "@/services/listeners";

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
  const [state, update] = useState<Omit<Context, "update">>(defaultContext);
  const toast = useToast();

  useEffect(() => {
    console.log({ state });
  }, [state]);

  useEffect(() => {
    const morbakID = sessionStorage.getItem("morbakID");

    (async () => {
      if (morbakID) {
        try {
          await recover(morbakID);
        } catch (e) {
          console.error(e);
          sessionStorage.removeItem("morbakID");
        }
      }
      try {
        const user = await getMyself();
        update((state) => ({
          ...state,
          user,
        }));
        sessionStorage.setItem("morbakID", user.id);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.room) return;
    const { players } = state.room;
    const userIds = players.map((p) => p.userId);
    const missingUsers = userIds.filter(
      (userId) => !state.users.find((u) => u.id === userId)
    );
    if (missingUsers.length === 0) return;
    (async () => {
      for (const userId of missingUsers) {
        try {
          const user = await getUserById(userId);
          update((state) => ({
            ...state,
            users: [...state.users, user],
          }));
        } catch (e) {
          console.error(e);
        }
      }
      update((state) => {
        const newState = structuredClone(state);
        newState.users = newState.users.filter(
          (user, index, self) =>
            index === self.findLastIndex((u) => u.id === user.id)
        );
        return newState;
      });
    })();
  }, [state.room]);

  useEffect(() => {
    const ctx = {
      update,
      state,
      toast,
    };
    const joinListener = userJoined(ctx);
    const removeUser = userLeft(ctx);
    const updateUser = userUpdated(ctx);

    socket.on("user-joined", joinListener);
    socket.on("user-left", removeUser);
    socket.on("user-update", updateUser);

    return () => {
      socket.off("user-joined", joinListener);
      socket.off("user-left", removeUser);
      socket.off("user-update", updateUser);
    };
  }, [state, toast, update]);

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
