export class GitRepository {
  constructor(private readonly cwd = Deno.cwd()) {
  }

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
