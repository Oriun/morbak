import { kickUser } from "@/services/functions";
import * as React from "react";
import { useToast } from "@chakra-ui/react";
import Button from "./button";
interface IUSerCardProps {
  id: string;
  name: string;
  avatar: string;
  owner: boolean;
  myself: boolean;
  canKick: boolean;
}

const UserCard: React.FunctionComponent<IUSerCardProps> = ({
  id,
  canKick,
  myself,
  owner,
  avatar,
  name,
}) => {
  const toast = useToast();
  async function handleKick() {
    if (!canKick) return;
    try {
      await kickUser(id);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
      });
    }
  }
  return (
    <div className="group flex items-center gap-2 rounded-lg px-4 py-2 bg-lapis-lazuli cursor-pointer">
      <img
        src={avatar}
        alt=""
        className="w-8 h-8 rounded-full border-solid border border-white shrink-0"
      />
      <span className="grow">{name}</span>
      {canKick+''}
      {owner && (
        <span className="py-1 px-2 bg-caribbean-current text-white rounded-md text-xs font-semibold">
          OWNER
        </span>
      )}
      {canKick && (
        <Button className="text-xs hidden group-hover:flex px-2 py-1 rounded-md bg-rusty-red" onClick={handleKick}>
          Kick
        </Button>
      )}
    </div>
  );
};

export default UserCard;
