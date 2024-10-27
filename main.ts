import { run } from "@drizzle-team/brocli";
import listCommand from "./commands/list.ts";
import pruneCommand from "./commands/prune.ts";

if (import.meta.main) {
  await run([listCommand, pruneCommand], {
    name: "git-gone",
    description: "Prune merged branches",
    version: "0.1.0",
  });
}
