# mo-hardware

English | [简体中文](README.zh-CN.md)

Historical hardware source repository, being consolidated into mo-docs/hardware/. In the unified architecture, mo-docs owns software/hardware content and developer owns the only website frontend, build and deployment. Historical files, training, tags and releases remain available. The unified site has not been rolled out and this repository is not archived.

**Start new hardware maintenance in mo-docs `hardware/training/`.** The [training guide here (Chinese)](training/README.zh-CN.md) preserves the pre-migration workflow. It includes a browser-first GitHub walkthrough, screenshots, a complete exercise and detailed instructions for every content category. Developers should also read [CONTRIBUTING.md](CONTRIBUTING.md); [CONTENT-CONTRACT.md](CONTENT-CONTRACT.md) defines the content and website handoff.

## Role in the Mo series

[![Mo repository ownership and unified website](architecture/repository-map.en.svg)](architecture/repository-map.en.svg)

| Repository | Maintained source | Delivery responsibility |
|---|---|---|
| **developer** · GitLab | Website components, routes, search, integration and contracts | The complete website, release composition and deployment |
| [mo-docs](https://github.com/inhandnet/mo-docs) | Software/hardware tutorials, specifications, media, design files and training | Versioned content and reference assets |
| [mo-tools](https://github.com/inhandnet/mo-tools) | Toolchain/SDK selection, environment setup, reusable tools and Studio | Tool metadata and source packages |
| [mo-models](https://github.com/inhandnet/mo-models) | Model catalog, compilation resources, compatibility and raw benchmarks | Model references, evidence and artifact status |
| [mo-examples](https://github.com/inhandnet/mo-examples) | Complete examples with related firmware, clients and configuration | Example sources and their requirements |
| **Mo\*** · product repositories | Each product's BSP, drivers, root filesystem, image build and flashing | Product images and checksummed release metadata |

`Mo*` covers independently maintained product repositories such as [Mo62A](https://github.com/inhandnet/Mo62A), Mo68A, Mo69A, Mo67A, Mo3588 and Mo3568. The framework does not fix their number. Hardware content and maintainer training move from mo-hardware into mo-docs; mo-hardware remains a historical migration source and is not a separate member of the target website composition.

Each source repository publishes ordinary versions. Developer alone has website RC/final channels. The target composition binds **developer + mo-docs + mo-tools + mo-models + mo-examples + selected Mo\*** to exact commits and consumed-asset hashes. A new source release does not change an already frozen website combination. Tutorial applicability, PCB revisions, image versions and actual validation remain distinct.

## Historical layout and migration mapping

[![From hardware content to website and releases](architecture/ownership.en.svg)](architecture/ownership.en.svg)

| Path | Hardware content | Training chapter |
|---|---|---|
| `products/<product>/overview/` | Product identity, specifications, sources and applicability | [Product](training/categories/01-product.zh-CN.md) |
| `products/<product>/images/` | Product photographs, connector views and reference captures | [Images](training/categories/02-images.zh-CN.md) |
| `products/<product>/interfaces/` | Connectors, physical pins, electrical conditions and signals | [Interfaces](training/categories/03-interfaces.zh-CN.md) |
| `products/<product>/schematics/` | Schematics, circuit explanations and source identifiers | [Schematics](training/categories/04-schematics.zh-CN.md) |
| `products/<product>/pcb/` | Approved public PCB files, stackups and manufacturing scope | [PCB](training/categories/05-pcb.zh-CN.md) |
| `products/<product>/mechanical/` | STEP models, dimensions, assembly and reference limits | [Mechanical](training/categories/06-mechanical.zh-CN.md) |
| `products/<product>/revisions/` | PCB/assembly identification and engineering changes | [Revisions](training/categories/07-revisions.zh-CN.md) |
| `products/<product>/validation/power-thermal/` | Conditions, meters, raw measurements and conclusions | [Power/thermal](training/categories/08-power-thermal.zh-CN.md) |
| `products/<product>/validation/interfaces/` | Wiring, methods, acceptance criteria and test results | [Interface tests](training/categories/09-interface-tests.zh-CN.md) |
| `products/<product>/compliance/` | Certificates, declarations, reports and applicability | [Compliance](training/categories/10-compliance.zh-CN.md) |
| `accessories/` | Shared accessory records, guides and board relationships | [Accessories](training/categories/11-accessories.zh-CN.md), [compatibility](training/categories/12-compatibility.zh-CN.md) |
| `templates/` | Reserved category templates; Excel conversion is not implemented | [Template rules](training/README.zh-CN.md#模板与语言规则) |
| `training/` | Maintainer instructions, examples and screenshots; outside product site mapping | [Web workflow](training/github-workflow.zh-CN.md) |
| `site/` | Source mapping, configuration, theme, search and generated output | [Architecture](ARCHITECTURE.md), maintained by software engineers |
| `scripts/`, `tests/`, `.github/`, `.githooks/` | Content checks, governance, tests and releases | Maintained by software engineers |

Contributors maintain ordinary `*.en-US.md` and actual attachment bytes; MDX and frontend coding are not required. The product site is English; training is Chinese. New pages and attachments require a software maintainer to update `site/content-map.json` and navigation. Uploading a file alone does not publish it on the website. Never edit `site/.generated/`, `site/.docusaurus/` or `site/build/`.

The source map retains 33 pages migrated from mo-docs `cbc6053`, plus three entry pages. Mo62A has source text, images, complete schematic PDFs and a STEP ZIP. Mo68A material directories remain reserved; inherited specifications and Coming soon pages do not constitute new validation. Excel `product.xlsx` / `record.xlsx`, field semantics and conversion remain future work. `manifest.json` is a file/source inventory; `records: []` does not claim structured hardware qualification.

## Historical workflow and current permissions

The steps below describe the retained historical project. New content belongs in mo-docs and uses unified website acceptance; do not extend the old deployment with new hardware RCs.

1. Locate the source, establish provenance, board/assembly applicability and publication scope.
2. Create a topic branch from current `master`; edit text and attachments while preserving download compatibility.
3. Open a PR to `master`, inspect the diff, `commit-message`, `ci` and the corresponding site preview.
4. Apply feedback on the same branch. An Admin squash-merges after required checks; the source branch is deleted automatically.
5. The merged build updates Pages. An Admin creates a separate annotated Tag to release the test site.

| Action | Write / hardware contributor | Admin |
|---|---|---|
| Create, update or delete topic branches; open PRs | Yes | Yes |
| Directly push or delete `master` | No | Cannot bypass PR / required CI |
| Merge a PR after successful CI | No | Yes, including their own PR; no additional review required |
| Create release tags | No | Yes |
| Rewrite or delete existing tags | No | Also prohibited by the independent immutable-tag rule |

The protection design separates master permissions from non-bypassable PR/CI requirements, and tag creation permissions from non-bypassable tag immutability: two master rules and two tag rules. Existing immutable-tag protection is retained. These four rules are active and have been read back from the repository settings; automatic source-branch deletion is enabled.

Use short English Conventional Commit titles, for example `docs(mechanical): clarify reference model usage`. Titles are limited to 72 characters; a body is optional. No bilingual `Message:` block, `Co-Authored-By` trailer or CI-skip marker is required or accepted as a workflow shortcut. Replace GitHub's generated edit title with a compliant title. Follow the [illustrated browser workflow](training/github-workflow.zh-CN.md).

## Historical project checks and preview

Use Node.js 22. Installation configures this clone's commit-msg/pre-push hooks:

```bash
npm ci
npm test
npm run typecheck
node scripts/check-content.mjs
npm run build
npx playwright install chromium
npm run test:site
npm run start
```

The development server defaults to `http://127.0.0.1:8042/`. Check who owns an existing preview before using its port. `npm run build` produces the complete site and search index; the development server does not produce full-text search. Checks use the Git file list, so add new files to Git before checking. The optional lightweight material index needs explicit arguments documented in [test/README.md](test/README.md); it does not replace full-site acceptance.

| Variable | Purpose |
|---|---|
| `HARDWARE_SITE_URL` | Site origin, for example `https://developer.inhand.online` |
| `HARDWARE_BASE_URL` | Leading/trailing slash path: `/hardware-docs/` for test, `/mo-hardware/` for Pages |
| `DOCUMENTATION_URL` | Matching software documentation URL |
| `DEVELOPER_PORTAL_URL` | Matching portal URL |
| `HARDWARE_PREVIEW` / `HARDWARE_PREVIEW_LABEL` | Preview banner and build identity |
| `HARDWARE_ENVIRONMENT` | Environment in `deployment.json` |

## Preview, versions and releases

[![Release composition and promotion](architecture/release-flow.en.svg)](architecture/release-flow.en.svg)

This diagram describes the unified target, not a completed retirement of the old hardware site. First verify text, attachment hashes, training and old URLs; retire old deployment only after developer full-site and rollback acceptance. Do not extend a third website release line with new hardware RCs during migration. Existing scripts, tags and releases remain for traceability and recovery; repository archival is separate.

The new maintenance flow lives in mo-docs/hardware/training/. Independent-site operations in this repository and its old training describe the pre-migration project.

## Content and license

Specifications require attributable source material; test results require conditions and original evidence. Keep unrecorded, untested, design-reference and passing-test states distinct. Training exercises are not hardware evidence. Website content contains no sale prices; purchasing links lead to the store.

Use the [contact page](https://developer.inhand.online/contact/) for product questions, Issues/PRs for documentation corrections and [SECURITY.md](SECURITY.md) for sensitive reports. Original content is licensed under [CC BY-SA 4.0](LICENSE). Third-party attachments, fonts, software and GitHub documentation screenshots retain their own licenses and notices; use official links when redistribution rights are unavailable. Content licensing does not grant patent/trademark rights or establish hardware certification.
