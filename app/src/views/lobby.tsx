import Button from "@/components/button";
import { useMainContext } from "@/contexts/main";
import { ask } from "@/services/socket";
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface ILobbyViewProps {}

const LobbyView: React.FunctionComponent<ILobbyViewProps> = (props) => {
  const navigate = useNavigate();
  const { room, users, user, update } = useMainContext();
  React.useEffect(() => {
    (async () => {
      if (!user) {
        console.log("no user");
        const getUser = await ask("me")();
        console.log({ getUser });
        if (!getUser || getUser === "not-found") return navigate("/");
        update((state) => ({
          ...state,
          user: JSON.parse(getUser),
        }));
      }
      console.log("handked user", room)
      if (!room) {
        console.log("no room")
        const getRoom = await ask("room")();
        console.log({ getRoom });
        if (!getRoom || getRoom === "not-joined") return navigate("/select");
        console.log("found room", getRoom);
        update((state) => ({
          ...state,
          room: JSON.parse(getRoom),
        }));
      }
    })();
  }, [room, user, users]);
  console.log({ room, user, users });

  async function startGame() {}
  async function leaveRoom() {
    const res = await ask("leave")();
    if (res !== "success") {
      alert("Erreur lors de la sortie de la room :" + res);
      return;
    }
    update((state) => {
      const newState = structuredClone(state);
      newState.room = null;
      if (newState.user) {
        newState.user.currentRoom = null;
      }
      return newState;
    });
    navigate("/select");
  }

  if (!room || !user) {
    return null;
  }
  return (
    <section className="w-96 flex flex-col items-stretch">
      <h2>En attente d'autres joueurs</h2>
      <p>Room {room.id}</p>
      <p>Temps: {room.timer}</p>
      <p>Grille: {room.timer}</p>
      <p>Condition de victoire: {room.winLength}</p>
      <p className="flex items-center gap-2 mt-6 mb-3">
        Joueurs{" "}
        <span className="p-1 bg-caribbean-current text-white rounded-full aspect-square flex w-5 h-5 items-center justify-center text-xs font-semibold">
          {room.players.length}
        </span>
      </p>
      <ul className="mb-8">
        {room.players
          .sort((a, b) => a.order - b.order)
          .map((player) => {
            const isMe = player.userId === user.id;
            const playerUser = users.find((user) => user.id === player.userId);
            const avatar = (isMe ? user.avatar : playerUser?.avatar) || "";
            if (isMe) console.log({ isMe, playerUser, user, avatar });
            const name = (isMe ? user.name : playerUser?.name) || "Anonymous";
            return (
              <li
                key={player.userId}
                className="flex items-center gap-2 rounded-lg px-4 py-2 bg-lapis-lazuli"
              >
                <img
                  src={avatar}
                  alt=""
                  className="w-8 h-8 rounded-full border border-white"
                />
                {name}
              </li>
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
