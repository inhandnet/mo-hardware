# Contributing to mo-hardware

Hardware contributors should begin with the [illustrated training guide](training/README.zh-CN.md). Maintain the authoritative files under `products/` or `accessories/`, including their provenance, applicable revisions, actual validation and untested scope. Current inputs are ordinary Markdown and attachment bytes; Excel conversion is not implemented. Read [CONTENT-CONTRACT.md](CONTENT-CONTRACT.md).

## Branches and messages

Write collaborators may create, update and delete topic branches. External contributors can fork the public repository. Start from current master and open a PR to master; only Admins merge or create release tags. Required `commit-message` and `ci` checks apply to Admins too. An Admin may merge their own PR without a second approval. Squash merges delete their source branches automatically.

Use a short English Conventional Commit title, such as:

```text
docs(mechanical): clarify the reference model scope
```

Scope is optional; types are listed in `config/repository-policy.json`. Start the subject with a lowercase letter, do not end with a period, and keep the title within 72 characters. An optional body starts after a blank line and normally wraps at 72 characters; URL/code lines are exempt. No bilingual Message block is required. Do not add Co-Authored-By trailers, CI-skip markers, private infrastructure details or credentials. Legacy messages remain readable through the repository-specific history boundary.

PR titles use the same convention. PR bodies describe the change, sources, applicability, verification and unresolved items. GitHub's default file-edit titles may not comply: replace them before saving. A later valid commit does not repair an earlier invalid title in the same PR.

## Local verification

Use Node.js 22 (`.nvmrc`). `npm ci` installs local commit-msg/pre-push hooks and the commit template. CI sets `CI=true` and does not install local hooks. Web edits are checked by CI after saving.

```bash
npm ci
git add <specific-new-paths>
npm test
node scripts/check-content.mjs
npm run typecheck
npm run build
npx playwright install chromium
npm run test:site
```

Content checks use the Git file list. Do not edit generated `site/.generated/`, `site/.docusaurus/` or `site/build/`. New routes/assets require reviewed source-map and navigation updates; arbitrary uploaded files do not automatically appear on the website. Preserve existing URLs and anchors, or provide a verified compatibility plan.

CI also checks shell syntax, ShellCheck and YAML. A green result proves automated checks, not electrical safety, mechanical fit or compliance. Confirm the exact preview build; shared Pages may have been replaced by another PR or master build.

## Releases

Only an Admin performs these steps after a reviewed merge. Choose an unused version; never replace or delete a published tag. RC tags are prereleases and do not become latest stable.

```bash
git switch master
git pull --ff-only
TAG=V1.0.1-rc5  # Example only: choose the next unused approved version.
git ls-remote --tags origin "refs/tags/$TAG" "refs/tags/$TAG^{}"
# Stop if either ref exists. Confirm master is clean before continuing.
git tag -a "$TAG" -m "$TAG"
git push origin "refs/tags/$TAG"
```

These commands are instructions, not authorization to publish during a content review. Release tags must be annotated, follow `VX.Y.Z` / `VX.Y.Z-rcN`, and point to a commit in master history. GitHub checks tags after push; local pre-push does not prevalidate tags. Creating a tag through a web Release form is not a substitute for this process.

Follow the release validation, publish and test-deploy jobs to completion. Verify asset checksums, the online deployment marker and affected downloads. A successful GitHub Release with a failed deploy is not a successful website rollout. Current automatic deployment covers the test platform only; production hosting remains unconfigured.

English changelog entries are grouped under English or fixed Chinese headings; legacy English summaries are supported. Translation APIs remain placeholders. SPDX describes repository distribution, not the board's component BOM.

## Reports and licensing

Use Issues/PRs for material errors, the [contact page](https://developer.inhand.online/contact/) for product questions and [SECURITY.md](SECURITY.md) for sensitive reports. Contributions follow [LICENSE](LICENSE), except identified third-party material retaining its own redistribution terms. Public branches and draft PRs are not confidential storage.
