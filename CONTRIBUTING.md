# Contributing to mo-hardware

Anyone can fork this public repository and open a PR to `master`.
Only administrators merge PRs or create tags. All changes to `master`, including
administrator changes, must pass `commit-message` and `ci` through a PR.

## Hardware content

Use the categories in [README.md](README.md) and the
[content contract](CONTENT-CONTRACT.md). Excel templates are still pending;
the current CI does not verify hardware facts or workbook field semantics.
Do not upload confidential records, credentials or unlicensed third-party files.
Keep one authoritative copy of each record and state the validation scope.

Usage questions belong in the [community forum](https://community.inhand.com).
Use Issues for corrections and requests; follow [SECURITY.md](SECURITY.md)
for sensitive reports.

## Local checks

```bash
git config core.hooksPath .githooks
node --test
node scripts/check-content.mjs
```

CI also checks shell syntax, ShellCheck, YAML and the release manifest build.
Files are checked from the Git index/list; stage new files before local checks.
The commit and pre-push hooks both enforce bilingual messages.

## Commit and PR messages

Use `<type>(<scope>): <subject>`; scope is optional. Types are `feat`, `fix`,
`docs`, `refactor`, `sync`, `ci`, `chore`. Use a lowercase initial subject,
no trailing period, and a title of at most 72 characters. Separate the body
with a blank line. Keep body lines short and finish with exactly one block:

```text
docs(mechanical): add a revision-specific assembly reference

Message:
  en: Add a revision-specific assembly reference.
  zh: 补充对应版本的装配参考资料。
```

The PR title and body form the squash commit. Every contributed commit also
needs its own valid Message block. Do not include internal infrastructure or
credentials in public messages. Administrators use squash merge after checks
pass; do not bypass the checks with a direct push.

## Releases

After merging, an administrator creates an annotated `VX.Y.Z` or
`VX.Y.Z-rcN` tag on a commit in `master`. CI validates and packages the source
and material, then publishes a Release titled with that tag. RC releases are
prereleases. Use a new tag for a correction rather than replacing a tag.
See [README.md](README.md) for release contents and current integration limits.

Contributions must be distributable under [LICENSE](LICENSE), except clearly
identified third-party material with its own redistribution terms.
