---
name: scaffold-eth-pr
description: "Prepare a generic Scaffold-ETH 2 pull request package. Use for branch synchronization, pattern alignment, focused commits, commit messages, PR titles, PR descriptions, validation summaries, and fork-to-upstream PR preparation."
argument-hint: "Describe the source branch, target branch, and intended change."
---

# Scaffold-ETH 2 Pull Requests

Use this workflow to prepare a focused commit and a complete pull request description for any Scaffold-ETH 2 repository or fork. The PR is created on GitHub between repositories; never treat two local branches as the PR itself.

## Inputs

Collect the source repository, source branch, target repository, target branch, related issue, intended scope, and validation commands. Verify repository URLs and remote names instead of assuming that `origin` or `upstream` has the expected meaning.

## Required contribution checks

Follow Scaffold-ETH 2's contribution rules:

- Confirm that an issue exists and that the change has been discussed or agreed upon before opening a PR.
- Keep the PR focused on the issue. Do not mix unrelated cleanup, spelling fixes, environment policy changes, or broad refactors.
- Prefer the least-impact implementation that solves the issue. Preserve the target branch's defaults and behavior unless changing them is part of the agreed scope.
- Use a descriptive branch and commit message.
- Match the repository's existing formatting, package boundaries, hooks, and configuration patterns.
- Update the README when the change affects documented setup or supported networks.
- Include a clear PR title, concise structured description, issue link, validation steps, and screenshots or recordings when they clarify a user-facing change.
- Expect maintainers to request changes and resolve review conversations before merge. Scaffold-ETH 2 uses squash-and-merge.

## Procedure

### 1. Establish the source and target

```bash
git status --short --branch
git remote -v
git branch -vv
git ls-remote --heads <target-repository-url> <target-branch>
```

Do not silently substitute another target branch when the intended one does not exist. A missing target branch is a repository coordination issue that must be resolved before opening the PR.

Add a remote only if needed and after checking existing names:

```bash
git remote add target <target-repository-url>
```

### 2. Fetch and compare before editing

Fetch both repositories and compare the source branch with the exact target branch:

```bash
git fetch <fork-remote> <source-branch>
git fetch <upstream-remote> <target-branch>
git diff --stat <target-remote>/<target-branch>...<source-remote>/<source-branch>
git log --oneline --decorate <target-remote>/<target-branch>..<source-remote>/<source-branch>
```

Read the target branch's nearby implementation before changing code. Pay particular attention to current Scaffold-ETH hooks, network configuration, generated contract files, package scripts, linting, and environment-variable conventions.

### 3. Align the local branch with upstream patterns

If the source branch is based on an older Scaffold-ETH revision or its implementation does not match the target branch's patterns, update the local source branch before preparing the PR.

- Port the change onto the target branch's current patterns.
- Preserve unrelated user work; never use `git reset --hard` or `git checkout --` to discard it.
- Prefer a clean rebase onto the target branch when the branch is private and safe to rewrite.
- Otherwise merge the target branch and keep the history explicit.
- Resolve conflicts by following the target branch's current conventions, not by blindly preserving the older source implementation.
- Re-run validation after alignment.
- If history was rebased, push with `--force-with-lease`, never plain `--force`.

Keep changes in the existing Scaffold-ETH ownership boundaries. Do not introduce a new source of truth, abstraction, environment policy, generated artifact, or package dependency unless the issue requires it and the target branch's patterns support it. Treat generated files as PR content only when the repository's current workflow expects them.

For network integrations, preserve the original target-network defaults and make new networks opt-in through the existing configuration pattern. Do not add an environment variable that silently changes the app's default network. Do not include deployment JSON, generated ABIs, or deployed addresses unless the target repository explicitly requires committed deployment output for that integration.

For network-specific compiler behavior, keep the default compiler profile unchanged. Use the toolchain's supported build-profile or equivalent mechanism to scope compatibility settings such as `evmVersion` to the affected network. Validate both the default profile and the special network profile.

Prefer public package exports. Do not import implementation files through `node_modules` paths or suppress their missing types with `@ts-expect-error`. If a required component is not exported, either use the supported public component API or make the smallest upstream/package-export change necessary and explain it in the PR.

### 4. Validate the focused change

Run the narrowest relevant checks first, then the package checks required by the touched areas. Typical checks include:

```bash
yarn --cwd packages/hardhat check-types
yarn --cwd packages/hardhat lint
yarn --cwd packages/hardhat test
yarn --cwd packages/nextjs lint
yarn --cwd packages/nextjs build
git diff --check
```

When compiler behavior differs by network, also run the relevant profile checks, for example:

```bash
yarn --cwd packages/hardhat hardhat compile --build-profile default
yarn --cwd packages/hardhat hardhat compile --build-profile <network-profile>
```

Do not claim a check passed if dependencies, credentials, a chain, or a dev server prevented it from running. Record skipped checks and why.

### 5. Build the commit package

Review scope before committing:

```bash
git status --short
git diff --stat <target-remote>/<target-branch>...HEAD
git diff --check
```

The commit package should contain:

- A focused commit with a conventional, imperative message that names the behavior changed.
- No unrelated formatting, generated output, secrets, local environment files, or speculative refactors.
- No deployment artifacts or deployed addresses unless explicitly required by the target repository's conventions.
- A short scope summary and the exact validation results.

Use one focused commit when practical. If the work naturally has separate concerns, use a small number of independently reviewable commits rather than a sequence of fixup noise. Then publish the source branch:

```bash
git push -u <fork-remote> <source-branch>
```

Do not create a local PR. The source branch must be visible on the source repository before the GitHub PR is opened.

### 6. Build the PR description package

Prepare a PR title and body only after the target branch exists and the source branch is pushed. Use GitHub's compare view:

```text
https://github.com/<target-owner>/<target-repository>/compare/<target-branch>...<source-owner>:<source-branch>?expand=1
```

The PR package should include:

- A concise title naming the focused change.
- What changed and why.
- The related issue or a clear statement that no issue link is available yet.
- What was intentionally excluded and any known follow-up work.
- Validation commands and results, including skipped checks and their blockers.
- Risks, migration notes, deployment assumptions, or compatibility notes when relevant.
- Screenshots or recordings for user-facing behavior.

Before opening, verify the compare page shows the intended base repository, base branch, source repository, source branch, and only the intended commits.

## Completion criteria

The workflow is complete only when:

- The source branch is aligned with the current upstream target patterns.
- The diff is focused and reviewed for accidental environment or generated-file changes.
- Relevant checks have run or their blockers are documented.
- The source branch is pushed to the fork.
- The GitHub compare page targets the intended target repository and branch, and the intended source repository and branch.
- No local branch-to-branch PR was created or implied.
