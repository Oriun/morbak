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
import {
  getCurrentRoom,
  getMyself,
  getUserById,
  recover,
} from "@/services/functions";
import {
  gameStarted,
  roomUpdated,
  userJoined,
  userKicked,
  userLeft,
  userUpdated,
} from "@/services/listeners";
import { useNavigate } from "react-router-dom";

export type User = {
  id: string;
  avatar: string | null;
  name: string;
  currentRoom: string | null;
};
export type Room = {
  id: string;
  timer: number;
  turn: number;
  size: [number, number];
  board: ({
    row: number;
    col: number;
    playerId: string;
    image: string;
  } | null)[][];
  winLength: number;
  players: {
    userId: string;
    order: number;
  }[];
  history: ({
    row: number;
    col: number;
    playerId: string;
    image: string;
  } | null)[];
  ownerId: string;
  started: boolean;
};
export type Game = {
  id: string;
};
export type Context = {
  user: User | null;
  users: User[];
  room: Room | null;
  game: Game | null;
  isFetching: boolean;
  update: Dispatch<SetStateAction<Omit<Context, "update">>>;
};

const defaultContext: Omit<Context, "update"> = {
  user: null,
  isFetching: false,
  users: [],
  room: null,
  game: null,
};
const MainContext = createContext<Context>({
  ...defaultContext,
  update: () => ({
    user: null,
    isFetching: false,
    users: [],
    room: null,
    game: null,
  }),
});

export interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export function Provider({ children }: ProviderProps) {
  const [state, update] = useState<Omit<Context, "update">>(defaultContext);
  const [isFetching, setIsFetching] = useState(true);
  const toast = useToast();

  useEffect(() => {
    console.log("state update", { state });
  }, [state]);

  useEffect(() => {
    const morbakID = sessionStorage.getItem("morbakID");

    setIsFetching(true);
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
    })().finally(() => setIsFetching(false));
  }, []);

  useEffect(() => {
    if (!state.user) return;
    if (!state.user.currentRoom) return;
    if (state.user.currentRoom === state.room?.id) return;
    setIsFetching(true);
    (async () => {
      try {
        const room = await getCurrentRoom();
        update((state) => ({
          ...state,
          room,
        }));
      } catch (e) {
        console.error(e);
        const user = await getMyself();
        update((state) => ({
          ...state,
          user,
        }));
      }
    })().finally(() => setIsFetching(false));
  }, [state]);

  useEffect(() => {
    if (!state.room) return;
    const { players } = state.room;
    const userIds = players.map((p) => p.userId);
    const missingUsers = userIds.filter(
      (userId) => !state.users.find((u) => u.id === userId)
    );
    if (missingUsers.length === 0) return;
    setIsFetching(true);
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
    })().finally(() => setIsFetching(false));
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
    const kickListener = userKicked(ctx);
    const roomListener = roomUpdated(ctx);
    const startGame = gameStarted(ctx);

    socket.on("user-joined", joinListener);
    socket.on("user-left", removeUser);
    socket.on("user-update", updateUser);
    socket.on("user-kicked", kickListener);
    socket.on("room-update", roomListener);
    socket.on("game-started", startGame);

    return () => {
      socket.off("user-joined", joinListener);
      socket.off("user-left", removeUser);
      socket.off("user-update", updateUser);
      socket.off("user-kicked", kickListener);
      socket.off("room-update", roomListener);
      socket.off("game-started", startGame);
    };
  }, [state, toast, update]);

  return (
    <MainContext.Provider value={{ ...state, isFetching, update }}>
      {children}
    </MainContext.Provider>
  );
}

export const useMainContext = () => {
  return useContext(MainContext);
};

export default MainContext;
