import Button from "@/components/button";
import Input from "@/components/input";
import { useMainContext } from "@/contexts/main";
import useInput from "@/hooks/use-input";
import { ask } from "@/services/socket";
import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { renameUser } from "@/services/functions";

interface INameViewProps {}

const NameView: React.FunctionComponent<INameViewProps> = (props) => {
  const navigate = useNavigate();
  const { user, update } = useMainContext();
  const name = useInput("");
  const toast = useToast();
  const [params] = useSearchParams();
  const canGoBack = params.get("redirect") === "true";
  async function rename() {
    try {
      await renameUser(name.value);
      update((state) => {
        if (state.user === null) return state;
        const newState = structuredClone(state);
        newState.user!.name = name.value;
        return newState;
      });
      // @ts-ignore
      navigate(canGoBack ? -1 : "/select");
      toast({
        title: "Succès",
        description: "Pseudo mis à jour",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "Erreur",
        description: (e as Error).message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
  }
  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-sm">
      <h2 className="text-2xl font-semibold">Profil de jeu</h2>
      <div className="relative">
        <img
          className="w-20 h-20 bg-rusty-red rounded-full border-solid border-2 border-white"
          src={user?.avatar ?? ""}
        />
      </div>
      <Input
        autoComplete="off"
        className="w-full"
        placeholder="Pseudo"
        {...name}
      />
      <Button onClick={rename} className="w-full">
        {canGoBack ? "Mettre à jour" : "Commencer"}
      </Button>
      {canGoBack && (
        <Button
          className="bg-lapis-lazuli text-white w-full"
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>
      )}
    </div>
  );
};

export default NameView;
