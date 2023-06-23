import Button from "@/components/button";
import { useMainContext } from "@/contexts/main";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import {
  getCurrentRoom,
  getMyself,
  leaveCurrentRoom,
} from "@/services/functions";
import { ClipboardIcon } from "@heroicons/react/24/solid";
import UserCard from "@/components/user-card";

interface ILobbyViewProps {}

const LobbyView: React.FunctionComponent<ILobbyViewProps> = (props) => {
  const navigate = useNavigate();
  const { room, users, user, update } = useMainContext();
  const toast = useToast();
  React.useEffect(() => {
    (async () => {
      if (!user) {
        try {
          const getUser = await getMyself();
          update((state) => ({
            ...state,
            user: getUser,
          }));
        } catch (e) {
          return navigate("/");
        }
      }
      if (!room) {
        try {
          const currentRoom = await getCurrentRoom();
          update((state) => ({
            ...state,
            room: currentRoom,
          }));
        } catch (e) {
          return navigate("/select");
        }
      }
    })();
  }, [room, user, users]);

  async function startGame() {}
  async function leaveRoom() {
    try {
      await leaveCurrentRoom();
      update((state) => {
        const newState = structuredClone(state);
        newState.room = null;
        if (newState.user) {
          newState.user.currentRoom = null;
        }
        return newState;
      });
      navigate("/select");
    } catch (e) {
      toast({
        title: "Erreur lors de la sortie de la room",
        description: (e as Error).message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  if (!room || !user) {
    return null;
  }

  function copyRoomId() {
    navigator.clipboard.writeText(room!.id);
    toast({
      title: "ID de la room copié",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  }

  return (
    <section className="w-96 max-w-[90vw] flex flex-col items-stretch">
      <div className="flex items-center flex-col gap-3">
        <h2 className="text-xl">Room</h2>
        <h4 className="text-lg">En attente d'autres joueurs</h4>
        <Button className="flex items-center" onClick={copyRoomId}>
          {room.id} <ClipboardIcon className="w-4 h-4 text-indigo-dye" />
        </Button>
      </div>
      <p>Temps: {room.timer}</p>
      <p>Grille: {room.timer}</p>
      <p>Condition de victoire: {room.winLength}</p>
      <p className="flex items-center gap-2 mt-6 mb-3">
        Joueurs{" "}
        <span className="p-1 bg-caribbean-current text-white rounded-full aspect-square flex w-5 h-5 items-center justify-center text-xs font-semibold">
          {room.players.length}
        </span>
      </p>
      <ul className="mb-8 flex flex-col gap-1">
        {room.players
          .sort((a, b) => a.order - b.order)
          .map((player) => {
            const isOwner = room.ownerId === player.userId;
            const isMe = player.userId === user.id;
            const playerUser = users.find((user) => user.id === player.userId);
            const avatar = (isMe ? user.avatar : playerUser?.avatar) || "";
            const name = (isMe ? user.name : playerUser?.name) || "Anonymous";
            return (
              <UserCard
                key={player.userId}
                id={player.userId}
                name={name}
                avatar={avatar}
                owner={isOwner}
                myself={isMe}
                canKick={!isMe && !isOwner && room.ownerId === user.id}
              />
            );
          })}
      </ul>
      <div className="flex flex-col items-stretch gap-2">
        {room.ownerId === user.id && (
          <Button onClick={startGame}>Commencer la partie</Button>
        )}
        <Button className="bg-rusty-red text-white" onClick={leaveRoom}>
          Quitter la room
        </Button>
      </div>
    </section>
  );
};

export default LobbyView;
