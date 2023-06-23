import Button from "@/components/button";
import Input from "@/components/input";
import useInput from "@/hooks/use-input";
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface INameViewProps {}

const NameView: React.FunctionComponent<INameViewProps> = (props) => {
  const navigate = useNavigate();
  const name = useInput("");
  function rename() {
    console.log("rename");
    navigate("/select");
  }
  return (
    <div className="flex flex-col gap-4 items-start w-full max-w-sm">
      <h2 className="text-2xl font-semibold">Choisis un pseudo</h2>
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
