import { describe, it } from "@std/testing/bdd";
import { assertSpyCall, assertSpyCalls, spy, stub } from "@std/testing/mock";
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
      const branches = ["branch1", "branch2"];
      const listCommand = setupSut({ branches });

      await listCommand.handler?.({
        fetch: false,
        gitRepo: "",
      });
      assertSpyCalls(logSpy, 2);
      assertSpyCall(logSpy, 0, { args: [branches[0]] });
      assertSpyCall(logSpy, 1, { args: [branches[1]] });
    });

    describe("when fetch is enabled", () => {
      it("fetches prune", async () => {
        const fetchPruneSpy = spy();
        const listCommand = setupSut({
          fetchPruneSpy,
        });
        await listCommand.handler?.({
          fetch: true,
          gitRepo: "",
        });
        assertSpyCalls(fetchPruneSpy, 1);
      });
    });
  });
});

interface SetupSutOptions {
  branches?: string[];
  fetchPruneSpy?: () => void;
}

function setupSut({
  branches = [],
  fetchPruneSpy = () => {},
}: SetupSutOptions = {}) {
  const gitRepo = {
    fetchPrune: fetchPruneSpy,
    getMergedBranches: () => Promise.resolve(branches),
  } as GitRepository;

  return createListCommand(() => gitRepo);
}
