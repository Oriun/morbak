import { CreateToastFnReturn } from "@chakra-ui/react";
import type { Context, User } from "@/contexts/main";

export interface IListenerProps {
  update: Context["update"];
  toast: CreateToastFnReturn;
  state: Omit<Context, "update">;
}

export function userJoined({ update, toast }: IListenerProps) {
  return function (data: string) {
    console.log("user-joined", data);
    const user = JSON.parse(data);
    update((state) => {
      const newState = structuredClone(state);
      newState.users = [...newState.users, user];
      if (!newState.room) return newState;
      newState.room = {
        ...newState.room,
        players: [
          ...newState.room.players,
          { userId: user.id, order: newState.room.players.length },
        ],
      };
      return newState;
    });
    toast({
      title: `${user.name} joined the room`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
}

export function userLeft({ update, toast }: IListenerProps) {
  return function (data: string) {
    console.log("user-left", data);
    const user = JSON.parse(data);
    update((state) => {
      const newState = structuredClone(state);
      newState.users = newState.users.filter((u) => u.id !== user.id);
      if (!newState.room) return newState;
      newState.room = {
        ...newState.room,
        players: newState.room.players.filter((p) => p.userId !== user.id),
      };
      return newState;
    });
    toast({
      title: `${user.name} left the room`,
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };
}

export function userKicked({ update, toast }: IListenerProps) {
  return function (data: string) {
    console.log("user-kicked", data);
    const user = JSON.parse(data);
    update((state) => {
      const newState = structuredClone(state);
      newState.users = newState.users.filter((u) => u.id !== user.id);
      if (user.id === state.user?.id) {
        newState.user = user;
        newState.room = null;
      }
      if (!newState.room) return newState;
      newState.room = {
        ...newState.room,
        players: newState.room.players.filter((p) => p.userId !== user.id),
      };
      return newState;
    });
    toast({
      title: `${user.name} was kicked from the room`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };
}

export function userUpdated({ update, state }: IListenerProps) {
  return function (data: string) {
    console.log("user-update", data);
    const user = JSON.parse(data) as User;
    update((state) => {
      const newState = structuredClone(state);
      newState.users = newState.users.map((u) => {
        if (u.id === user.id) return user;
        return u;
      });
      if (!newState.room) return newState;
      if (user.id === state.user?.id) {
        newState.user = user;
      }
      return newState;
    });
  };
}
