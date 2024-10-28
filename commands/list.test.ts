import { describe, it } from "@std/testing/bdd";
import { assertSpyCall, assertSpyCalls, stub } from "@std/testing/mock";
import { expect } from "@std/expect";
import createListCommand from "./list.ts";
import type { GitRepository } from "../git-repository.ts";

describe("commands/list", () => {
  it("is a command", () => {
    const listCommand = setupSut();
    expect(listCommand).toBeDefined();
  });

  it("has a name", () => {
    const listCommand = setupSut();
    expect(listCommand.name).toBeDefined();
  });

  describe("when executed", () => {
    it("lists all merged branches", async () => {
      using logSpy = stub(console, "log", () => {});
      const listCommand = setupSut(["branch1", "branch2"]);
      const branches = await listCommand.handler?.({
        fetch: false,
        gitRepo: "",
      });
      assertSpyCalls(logSpy, 2);
      assertSpyCall(logSpy, 0, { returned: branches });
    });
  });
});

function setupSut(branches: string[] = []) {
  const gitRepo = {
    fetchPrune: async () => {},
    getMergedBranches: () => Promise.resolve(branches),
  } as GitRepository;

  return createListCommand(() => gitRepo);
}
