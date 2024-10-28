import { run } from "@drizzle-team/brocli";
import listCommand from "./commands/list.ts";
import pruneCommand from "./commands/prune.ts";
import { GitRepository } from "./git-repository.ts";

const gitRepoFactory = (path?: string) => new GitRepository(path);

if (import.meta.main) {
  await run([listCommand(gitRepoFactory), pruneCommand], {
    name: "git-gone",
    description: "Prune merged branches",
    version: "0.1.0",
  });
}
