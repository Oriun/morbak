import Button from "@/components/button";
import GameInfos from "@/components/game-info";
import WinnerOverlay from "@/components/winner-overlay";
import { Room, User, useMainContext } from "@/contexts/main";
import { play, playNull } from "@/services/functions";
import socket from "@/services/socket";
import { useToast } from "@chakra-ui/react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface IGameViewProps {}

const GameView: React.FunctionComponent<IGameViewProps> = (props) => {
  const { room, isFetching, users, update, user: me } = useMainContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [winner, setWinner] = React.useState<User | null>(null);
  const [modalOpen, setModalOpen] = React.useState(true);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const [remainingTime, setRemainingTime] = React.useState<number | null>(null);

  const currentPlayer = getCurrentPlayer(room, users, me);
  const isCurrentPlayer = currentPlayer === "Vous";

  React.useEffect(() => {
    if (!room?.started && !isFetching) {
      navigate("/");
    }
  }, [room, isFetching]);

  React.useEffect(() => {
    if (!room) return;

    if (!isCurrentPlayer || winner) {
      clearTimeout(timer.current!);
      setRemainingTime(null);
    } else if (remainingTime === null) {
      setRemainingTime(room.timer);
    }
  }, [room, me]);

  React.useEffect(() => {
    if (remainingTime === null) return;

    if (remainingTime === 0) {
      setRemainingTime(null);
      clearTimeout(timer.current!);
      playNull()
        .then(
          () => {},
          () => {}
        )
        .finally(() => {
          toast({
            title: "Vous avez perdu votre tour",
            description: "Vous avez dépassé le temps imparti",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      timer.current = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    }
  }, [remainingTime]);

  React.useEffect(() => {
    function gameEnded(winnerId: string) {
      const _winner = users.find((user) => user.id === winnerId)!;
      setWinner(_winner);
    }
    function gameAborted() {
      update((state) => {
        const newState = structuredClone(state);
        newState.room = null;
        if (newState.user) {
          newState.user.currentRoom = null;
        }
        return newState;
      });
      navigate("/select");
      toast({
        title: "Game aborted",
        description: "The other player left the game",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
    socket.on("game-ended", gameEnded);
    socket.on("game-aborted", gameEnded);
    return () => {
      socket.off("game-ended", gameEnded);
      socket.off("game-aborted", gameAborted);
    };
  }, [room, winner, setWinner]);

  if (!room) return null;

  function handleClick(row: number, col: number) {
    return async () => {
      try {
        await play(row, col);
      } catch (e) {
        toast({
          title: "Invalid move",
          description: "You can't play here",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    };
  }
  function getImage(playerId: string, image?: string) {
    if (image) return image;
    const user = users.find((user) => user.id === playerId);
    return user?.avatar ?? "";
  }

  function close() {
    setModalOpen(true);
  }
  function next() {
    update((state) => ({
      ...state,
      room: null,
    }));
    navigate("/select");
  }

  function quitGame() {
    socket.emit("quit");
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

  return (
    <section className="flex flex-col items-center gap-5 w-min">
      <h4 className="w-full text-center text-xl font-medium">
        {isCurrentPlayer ? (
          <>C&apos;est votre tour... {remainingTime}s</>
        ) : (
          <>C&apos;est le tour de {currentPlayer}</>
        )}
      </h4>
      <GameInfos {...room} />
      <div id="board" className="flex flex-col gap-[2px]">
        {room.board.map((row, i) => (
          <div key={i} className="flex gap-[2px]">
            {row.map((col, j) => {
              const turnLocked =
                room.history.length -
                room.history.findLastIndex(
                  (h) => h && h.row === i && h.col === j
                );
              const locked =
                turnLocked <= room.history.length &&
                turnLocked <= room.winLength + 1;
              return (
                <div
                  key={j}
                  className="w-14 h-14 p-1.5 bg-white rounded-sm cursor-pointer relative text-xs"
                  onClick={handleClick(i, j)}
                >
                  {col && (
                    <img
                      src={getImage(col?.playerId, col?.image)}
                      alt=""
                      className="w-11 h-11 rounded-full shadow-sm shadow-black/10"
                    />
                  )}
                  {locked && (
                    <div className="absolute top-[2px] right-[2px] text-indigo-dye">
                      {room.winLength + 1 - turnLocked + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Button onClick={quitGame} className="w-full">
        Quitter
      </Button>
      {modalOpen && <WinnerOverlay winner={winner} close={close} next={next} />}
    </section>
  );
};

export default GameView;

function getCurrentPlayer(room: Room | null, users: User[], me: User | null) {
  if (!room) return null;
  const { userId } = room.players.at(room.turn % room.players.length)!;
  if (userId === me?.id) return "Vous";
  const player = users.find((user) => user.id === userId);
  return player?.name ?? "Unknown";
}
