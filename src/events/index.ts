import { join } from "./join.js";
import { create } from "./create.js";
import { kick } from "./kick.js";
import { leave } from "./leave.js";
import { rename } from "./rename.js";
import { start } from "./start.js";
import { user } from "./user.js";
import { me } from "./me.js";
import { test } from "./test.js";
import { room } from "./room.js";

export const Events: Record<string, typeof join> = {
  join,
  create,
  kick,
  leave,
  rename,
  start,
  user,
  me,
  test,
  room
};
