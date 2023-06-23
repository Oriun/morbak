import Button from "@/components/button";
import Input from "@/components/input";
import { useMainContext } from "@/contexts/main";
import useInput from "@/hooks/use-input";
import { ask } from "@/services/socket";
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface INameViewProps {}

const NameView: React.FunctionComponent<INameViewProps> = (props) => {
  const navigate = useNavigate();
  const { user, update } = useMainContext();
  const name = useInput("");
  async function rename() {
    const res = await ask("rename")(JSON.stringify({ name: name.value }));
    if (res !== "success") {
      alert("Erreur lors de la création du profil :" + res);
      return;
    }
    update((state) => {
      if (state.user === null) return state;
      const newState = structuredClone(state);
      newState.user!.name = name.value;
      return newState;
    });
    navigate("/select");
  }
  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-sm">
      <h2 className="text-2xl font-semibold">Profil de jeux</h2>
      <div className="relative">
        <img
          className="w-20 h-20 bg-rusty-red rounded-full border-2 border-white"
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
        Commencer
      </Button>
    </div>
  );
};

export default NameView;
