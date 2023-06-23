import { join } from "./join.js";
import { create } from "./create.js";
import { kick } from "./kick.js";
import { leave } from "./leave.js";
import { rename } from "./rename.js";
import { start } from "./start.js";
import { user } from "./user.js";
import { me } from "./me.js";
import { play } from "./play.js";
import { test } from "./test.js";

export const Events: Record<string, typeof join> = {
  join,
  create,
  kick,
  leave,
  rename,
  start,
  user,
  me,
  play,
  test
};
