import { run } from "@drizzle-team/brocli";
import buildListCommand from "./commands/list.ts";
import buildPruneCommand from "./commands/prune.ts";
import { GitRepository } from "./git-repository.ts";

const gitRepoFactory = (path?: string) => new GitRepository(path);
const listCommand = buildListCommand(gitRepoFactory);
const pruneCommand = buildPruneCommand(gitRepoFactory);

if (import.meta.main) {
  await run([listCommand, pruneCommand], {
    name: "git-gone",
    description: "Prune merged branches",
    version: "0.1.0",
  });
}
