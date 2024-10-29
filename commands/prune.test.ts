import { describe, it } from "@std/testing/bdd";
import {
  assertSpyCallAsync,
  assertSpyCalls,
  type Spy,
  spy,
  type SpyLike,
} from "@std/testing/mock";
import { expect } from "@std/expect";
import createPruneCommand from "./prune.ts";
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
      const deleteBranchSpy: Spy<unknown, [string], Promise<void>> = spy();
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
        const fetchPruneSpy = spy();
        const pruneCommand = setupSut({
          fetchPruneSpy,
        });
        await pruneCommand.handler?.({
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
  deleteBranchSpy?: Spy<unknown, [string], Promise<void>>;
}

function setupSut({
  branches = [],
  fetchPruneSpy = () => {},
  deleteBranchSpy = (branch: string) => Promise.resolve(),
}: SetupSutOptions = {}) {
  const gitRepo = {
    fetchPrune: fetchPruneSpy,
    getMergedBranches: () => Promise.resolve(branches),
    deleteBranch: deleteBranchSpy,
  } as unknown as GitRepository;

  return createPruneCommand(() => gitRepo);
}
