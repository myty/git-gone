/**
 * A simple class to interact with a Git repository.
 */
export class GitRepository {
  constructor(private readonly cwd = Deno.cwd()) {
  }

  /**
   * Fetch and prune the repository: `git fetch --prune`
   */
  async fetchPrune(): Promise<void> {
    const command = new Deno.Command("git", {
      cwd: this.cwd,
      args: ["fetch", "--prune"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stderr } = await command.output();
    if (code !== 0) {
      const errorString = new TextDecoder().decode(stderr);
      throw new Error(errorString);
    }
  }

  /**
   * Get a list of all local branches that have been merged and have a remote branch that no longer exists.
   */
  async getMergedBranches(): Promise<string[]> {
    const command = new Deno.Command("git", {
      cwd: this.cwd,
      args: [
        "for-each-ref",
        "--format",
        "%(refname:short) %(upstream:track)",
        "refs/heads",
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stderr, stdout } = await command.output();
    if (code !== 0) {
      const errorString = new TextDecoder().decode(stderr);
      console.error(errorString);
      return [];
    }

    const outputString = new TextDecoder().decode(stdout);

    return outputString.split("\n").map((branch) => branch.trim()).filter(
      (branch) =>
        branch && branch !== "* main" && branch !== "main" &&
        branch.endsWith("[gone]"),
    ).map((branch) => branch.replace("[gone]", "").trim());
  }

  /**
   * Delete a branch: `git branch -D <branch>`
   */
  async deleteBranch(branch: string): Promise<void> {
    const command = new Deno.Command("git", {
      cwd: this.cwd,
      args: ["branch", "-D", branch],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stderr } = await command.output();
    if (code !== 0) {
      const errorString = new TextDecoder().decode(stderr);
      console.error(`Failed to delete branch ${branch}: ${errorString}`);
      return;
    }

    console.log(`Deleted branch ${branch}`);
  }
}
