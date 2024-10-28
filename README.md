# git-gone

A simple script to remove all git branches that have been merged into the main remote branch.

## Pre-requisites

* [Deno](https://deno.com/)
* [Git](https://git-scm.com/)

## Installation

  ```sh
  deno install -g --allow-run -name git-gone jsr:@myty/git-gone
  ```

## Usage

### Help

  ```sh
  git gone -h
  ```

## Commands

### list

List all gone branches.

### prune

Delete all gone branches.

## Credits

All credits for the idea go to Eugene Yokota (see <http://eed3si9n.com/>):

* git gone: cleaning stale local branches at <http://eed3si9n.com/git-gone-cleaning-stale-local-branches>
* git-gone in Bash: <https://github.com/eed3si9n/git-gone>
* git-gone in Rust: <https://github.com/swsnr/git-gone>
