import Button from "@/components/button";
import Input from "@/components/input";
import { useMainContext } from "@/contexts/main";
import useInput from "@/hooks/use-input";
import { ask } from "@/services/socket";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { createRoom } from "@/services/functions";

interface ICreateViewProps {}

const CreateView: React.FunctionComponent<ICreateViewProps> = (props) => {
  const navigate = useNavigate();
  const { update } = useMainContext();
  const size = useInput<HTMLSelectElement>("6x6");
  const winLength = useInput<HTMLInputElement, number>(5);
  const timer = useInput<HTMLInputElement, number>(5);
  const toast = useToast();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("submit");
    try {
      const room = await createRoom(
        size.value.split("x").map((a) => parseInt(a)) as [number, number],
        winLength.value,
        timer.value
      );
      update((state) => ({
        ...state,
        room,
      }));
      navigate("/lobby");
    } catch (e) {
      toast({
        title: "Erreur lors de la création de la partie",
        description: (e as Error).message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 items-start w-64">
      <h2 className="text-2xl font-semibold w-full mb-8">Créer une partie</h2>
      <h4 className="text-lg font-medium">Taille de la grille</h4>
      <select {...size} className="h-10 text-black px-4 w-full mb-4">
        <option value="4x4">4 x 4</option>
        <option value="6x6">6 x 6</option>
        <option value="8x8">8 x 8</option>
      </select>
      <h4 className="text-lg font-medium">Condition de victoire</h4>
      <div className="w-full mb-4">
        <Input
          type="number"
          min={3}
          max={8}
          className="w-16 mr-4"
          {...winLength}
        />
        <span>symbols consécutifs</span>
      </div>
      <h4 className="text-lg font-medium">Timer (secondes)</h4>
      <Input
        type="number"
        placeholder="Temps"
        className="w-full"
        min={2}
        max={10}
        {...timer}
      />
      <Button className="w-full mt-8">Créer</Button>
    </form>
  );
};

export default CreateView;
