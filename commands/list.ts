import { boolean, command, positional } from "@drizzle-team/brocli";
import type { GitRepository } from "../git-repository.ts";

/**
 * CLI command to list all merged branches
 */
export default function buildListCommand(
  gitRepoFactory: (path?: string) => GitRepository,
) {
  return command({
    name: "list",
    desc: "List all merged branches",
    options: {
      gitRepo: positional().desc("Git repository path"),
      fetch: boolean().desc("Fetch prune").alias("f").default(false),
    },
    async handler({ fetch, gitRepo }) {
      const git = gitRepoFactory(gitRepo);
      if (fetch) {
        await git.fetchPrune();
      }
      const branches = await git.getMergedBranches();
      for (const branch of branches) {
        console.log(branch);
      }
    },
  });
}
