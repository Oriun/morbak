import { Room, User } from "@/contexts/main";
import { ask } from "./socket";

const errors: string[] = [
  "not-found",
  "user-not-found",
  "not-joined",
  "already-joined",
  "already-started",
  "not-owner",
  "kick-user-not-found",
];

export async function recover(id: string) {
  const recovery = await ask("recover")(id);
  if (!recovery || errors.includes(recovery)) {
    throw new Error("Can't recover");
  }
  return JSON.parse(recovery) as User;
}

export async function getMyself() {
  const data = await ask("me")();
  if (!data || errors.includes(data)) {
    throw new Error("Can't get myself");
  }
  return JSON.parse(data) as User;
}

export async function pingUser(id: string) {
  const data = await ask("ping")(id);
  if (!data || errors.includes(data)) {
    throw new Error("Can't ping user");
  }
  return JSON.parse(data) as User;
}

export async function getUserById(id: string) {
  const data = await ask("user")(id);
  if (!data || errors.includes(data)) {
    throw new Error("Can't get user");
  }
  return JSON.parse(data) as User;
}

export async function getCurrentRoom() {
  const data = await ask("room")();
  if (!data || errors.includes(data)) {
    throw new Error("Can't get current room");
  }
  return JSON.parse(data) as Room;
}

export async function createRoom(
  size: [number, number],
  winLength: number,
  timer: number
) {
  const creation = await ask("create")(
    JSON.stringify({ size, winLength, timer })
  );
  if (!creation || errors.includes(creation) || creation !== "success") {
    throw new Error("Can't create room");
  }
  const room = await getCurrentRoom();

  return room;
}
export async function joinRoom(id: string) {
  const res = await ask("join")(id);
  if (!res || errors.includes(res) || res !== "success") {
    throw new Error("Can't join room");
  }
  const room = await getCurrentRoom();

  return room;
}

export async function leaveCurrentRoom() {
  const res = await ask("leave")();
  if (!res || errors.includes(res) || res !== "success") {
    throw new Error("Can't leave room");
  }
}

export async function renameUser(name: string) {
  const res = await ask("rename")(JSON.stringify({ name }));
  if (!res || errors.includes(res) || res !== "success") {
    throw new Error("Can't rename");
  }
}


export async function kickUser(id: string) {
  const res = await ask("kick")(id);
  if (!res || errors.includes(res) || res !== "success") {
    throw new Error("Can't kick user");
  }
}

export async function startGame() {
  const res = await ask("start")();
  if (!res || errors.includes(res) || res !== "success") {
    throw new Error("Can't start game");
  }
}

export async function play(row: number, col: number) {
  const res = await ask("play")(JSON.stringify({ row, col }));
  if (!res || errors.includes(res) || res !== "success") {
    throw new Error("Can't play this move");
  }
}