import Button from "@/components/button";
import Input from "@/components/input";
import useInput from "@/hooks/use-input";
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface ISelectViewProps {}

const SelectView: React.FunctionComponent<ISelectViewProps> = (props) => {
  const navigate = useNavigate();
  const roomId = useInput("");
  function createRoom() {
    console.log("create room");
    navigate("/create");
  }
  function joinRoom() {
    console.log("join room");
    navigate(`/lobby`);
  }
  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-sm">
      <h2 className="text-2xl font-semibold">Rejoindre</h2>
      <Input placeholder="Session ID" {...roomId} />
      <Button onClick={joinRoom} className="w-full">Rejoindre</Button>
      <div className="h-4 border-t border-lapis-lazuli mt-4 w-full" />
      <h2 className="text-2xl font-semibold">Nouvelle partie</h2>
      <Button onClick={createRoom} className="w-full">Créer une partie</Button>
    </div>
  );
};

export default SelectView;
