import { boolean, command, positional } from "@drizzle-team/brocli";
import { GitRepository } from "../git-repository.ts";

/**
 * CLI command to prune all merged branches
 */
export default function createListCommand(
  gitRepoFactory: (path?: string) => GitRepository,
) {
  return command({
    name: "prune",
    desc: "Prune all merged branches",
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
        git.deleteBranch(branch);
        console.log(`Deleted branch ${branch}`);
      }
    },
  });
}
