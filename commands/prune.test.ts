import { describe, it } from "@std/testing/bdd";
import {
  assertSpyCallAsync,
  assertSpyCalls,
  type Spy,
  spy,
} from "@std/testing/mock";
import { expect } from "@std/expect";
import buildPruneCommand from "./prune.ts";
import type { GitRepository } from "../git-repository.ts";

describe("commands/prune", () => {
  it("is a command", () => {
    const pruneCommand = setupSut();
    expect(pruneCommand).toBeDefined();
  });

  it("has a name", () => {
    const pruneCommand = setupSut();
    expect(pruneCommand.name).toBeDefined();
  });

  describe("when executed", () => {
    it("removes all merged branches", async () => {
      const deleteBranchSpy = spy((_branch: string) => Promise.resolve());
      const branches = ["branch1", "branch2"];
      const pruneCommand = setupSut({
        branches,
        deleteBranchSpy,
      });

      await pruneCommand.handler?.({
        fetch: false,
        gitRepo: "",
      });
      assertSpyCalls(deleteBranchSpy, 2);
      assertSpyCallAsync(deleteBranchSpy, 0, { args: [branches[0]] });
      assertSpyCallAsync(deleteBranchSpy, 1, { args: [branches[1]] });
    });

    describe("when fetch is enabled", () => {
      it("fetches prune", async () => {
        const fetchPruneSpy = spy(() => Promise.resolve());
        const listCommand = setupSut({
          fetchPruneSpy,
        });
        await listCommand.handler?.({
          fetch: true,
          gitRepo: "",
        });
        assertSpyCalls(fetchPruneSpy, 1);
        assertSpyCallAsync(fetchPruneSpy, 0, { args: [] });
      });
    });
  });
});

interface SetupSutOptions {
  branches?: string[];
  fetchPruneSpy?: Spy<unknown, [], Promise<void>>;
  deleteBranchSpy?: Spy<unknown, [_branch: string], Promise<void>>;
}

function setupSut({
  branches = [],
  fetchPruneSpy,
  deleteBranchSpy,
}: SetupSutOptions = {}) {
  const gitRepo = {
    fetchPrune: fetchPruneSpy ?? (() => Promise.resolve()),
    getMergedBranches: () => Promise.resolve(branches),
    deleteBranch: deleteBranchSpy ?? (() => Promise.resolve()),
  } as unknown as GitRepository;

  return buildPruneCommand(() => gitRepo);
}
