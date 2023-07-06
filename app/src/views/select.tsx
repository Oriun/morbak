import Button from "@/components/button";
import Input from "@/components/input";
import { useMainContext } from "@/contexts/main";
import useInput from "@/hooks/use-input";
import { ask } from "@/services/socket";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { joinRoom } from "@/services/functions";

interface ISelectViewProps {}

const SelectView: React.FunctionComponent<ISelectViewProps> = (props) => {
  const navigate = useNavigate();
  const { update, room } = useMainContext();
  const roomId = useInput("");
  const toast = useToast();
  async function join() {
    try {
      const getRoom = await joinRoom(roomId.value);
      update((state) => {
        const newState = structuredClone(state);
        newState.room = getRoom;
        if (newState.user) {
          newState.user.currentRoom = roomId.value;
        }
        return newState;
      });
    } catch (e) {
      toast({
        title: "Erreur lors de la connexion au lobby",
        description: e,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
  }
  React.useEffect(() => {
    if (room) {
      navigate("/lobby");
    }
  }, [room]);
  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-sm">
      <h2 className="text-2xl font-semibold">Rejoindre</h2>
      <Input placeholder="ID de session" {...roomId} />
      <Button onClick={join} className="w-full">
        Rejoindre
      </Button>
      <div className="h-4 border-t-solid border-t border-lapis-lazuli mt-4 w-full" />
      <h2 className="text-2xl font-semibold">Nouvelle partie</h2>
      <Button onClick={() => navigate("/create")} className="w-full">
        Créer une partie
      </Button>

      <a target="_blank" href="/rules" className="text-white">
        Qu'est-ce que le morbak ?
      </a>
    </div>
  );
};

export default SelectView;
