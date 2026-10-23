# mo-hardware architecture

The repository owns hardware reference sources and an independent Docusaurus site. Hardware engineers maintain `products/` and `accessories/`; software maintainers implement `site/`, `scripts/`, `tests/` and workflows. The [training guide](training/README.zh-CN.md) explains each content category and its browser workflow.

## Sources and mappings

`site/content-map.json` records 33 inherited routes, the original mo-docs identities and the pinned migration source. `scripts/prepare-site.mjs` reads ordinary Markdown, resolves software-documentation URLs, assigns stable slugs and copies registered assets into `site/.generated/`. Three index pages complete the 36-page site. Generated files are build output, not contributor inputs.

`validateContentMap` checks source files, relative-path boundaries, page metadata, route collisions, output collisions and registered asset targets before generation. A new file is not automatically a page or download. Software maintainers add the corresponding route/asset mapping and navigation; hardware contributors supply the intended location and evidence. New route identities must follow the current `docs/.../*.mdx` identity convention even though source files are `.md`.

`site/sidebars.ts` joins hardware pages with external links to mo-docs. Its product/section configuration is explicit. Adding a product or category needs a reviewed code/configuration change, not just a folder. Mo68A product folders are reserved; inherited web references do not establish new validation.

## Build and browser layer

The Docusaurus build owns navigation, fixed-width/scrollable tables, local Roboto fonts, Pagefind search and base-aware asset links. The cache plugin keys Webpack output by site origin/base path. The deployment plugin writes the built commit, environment, origin, base and version into `deployment.json`.

Tests exercise content/manifests, archive bytes, page layout, search, local targets and downloads. CI uses `/mo-hardware/`; the test release uses `/hardware-docs/`. Local development defaults to `/`. External software and portal URLs must match the intended environment. GitHub's Markdown preview cannot fully resolve site-absolute image links or Docusaurus syntax.

## Governance

`config/repository-policy.json` defines the English Conventional Commit types, title limit, tag syntax and the hardware repository's legacy boundary. Both hooks and CI use `scripts/lib/policy.mjs`. Event text is read from GitHub event JSON, not interpolated into executable shell. Invalid Git ranges fail closed. Tests construct their own Git history and do not depend on checkout depth or developer remote refs.

Protection separates administrative master permissions from mandatory PR/check requirements, and administrative tag creation from immutable-tag rules. The two required check names remain `commit-message` and `ci`. PRs squash-merge, with zero mandatory extra approvals and automatic source-branch deletion. Existing tags cannot be rewritten or deleted, including by an Admin under the active immutable rule.

## Preview and releases

PR/master CI builds artifacts with read-only permissions and no deployment secrets. `pages-preview.yml` uses a separate deployment job; privileged jobs do not install or execute PR code. It consumes a successful CI artifact or manually builds trusted master. Pages is a shared preview and must be checked against the exact build identity.

All tag pushes trigger release validation. An annotated `VX.Y.Z` or `VX.Y.Z-rcN` tag must resolve to the checkout and a commit in master history. Release validation reruns CI, generates an inventory/changelog, builds the website, archives source material, generates an SPDX software inventory and computes checksums. The tag supplies the release version independently of the package-manager version.

Publication precedes deployment. The restricted `deploy-hardware` SSH action receives only the verified archive; the client checks the online marker and a representative page, then requests `rollback-hardware` on smoke-check failure. Host keys are pinned. Missing required test secrets fail the job. Production deployment is not integrated and is not implied by a stable Release.

## Boundaries

`manifest.json` is a file/source inventory with `content_status: migrated-reference`; `records: []` does not represent a validated hardware catalog. The SPDX inventory is not a board BOM. Workbook semantics, Excel conversion, hardware qualification and production hosting remain separate tasks.

`training/` contains maintainer examples and sourced screenshots. It is distributed with repository source material but is not in the product site's route/asset map. The examples do not add test results or qualification claims. Third-party screenshots retain their own license notices.
