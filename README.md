# mo-hardware

English | [简体中文](README.zh-CN.md)

Versioned hardware documentation and reference files for InHand Mo boards.
The hardware site builds and publishes independently with the visual style of
[mo-docs](https://github.com/inhandnet/mo-docs). Hardware contributors maintain
material; the software team maintains page templates and build automation.
This repository does not contain BSP, SDK or device application code.

## Status

The first site migration preserves the hardware, compliance and accessory pages
from [mo-docs at cbc6053](https://github.com/inhandnet/mo-docs/tree/cbc60530f3fa04ebdf7870dcfe47d08e753fb636).
The route/source map records all 33 inherited pages. The site adds three entry
pages, with the same theme, fonts, search and table layout as mo-docs.
Mo62A material includes reviewed images, STEP and schematic PDF downloads.

Mo68A website references retain their original content and Coming soon status;
the Overview already contained specifications. Its `products/mo68a/` directories
remain empty. No new Mo68A validation or source-code changes are implied.
Excel templates and semantic conversion remain planned. The inventory is not
a validated hardware catalog; manual measurements are not product maximums.

## Layout and ownership

| Path | Purpose |
| --- | --- |
| `products/<product>/product.xlsx` | Planned product identity and specifications workbook |
| `products/<product>/images/` | Standard product images |
| `products/<product>/interfaces/` | Connector definitions, pin tables and electrical limits |
| `products/<product>/schematics/` | Schematics and hardware module descriptions |
| `products/<product>/pcb/` | PCB material approved for public distribution |
| `products/<product>/mechanical/` | STEP, dimensions, tolerances and assembly references |
| `products/<product>/revisions/` | Board identification and revision history |
| `products/<product>/validation/power-thermal/` | Workload definitions, meter readings and telemetry |
| `products/<product>/validation/interfaces/` | Interface validation methods and results |
| `products/<product>/compliance/` | Applicable declarations, certificates and reports |
| `accessories/` | Shared accessory records and product compatibility |
| `templates/` | Reserved category-specific Excel and Markdown templates |
| `site/` | Docusaurus theme, navigation, source map and generated-site configuration |
| `test/` | Optional lightweight material index; Pages uses the full site |
| `scripts/`, `tests/`, `.github/`, `.githooks/` | Automation maintained by the software team |

Hardware contributors currently maintain ordinary `*.en-US.md` and attachments
in the content directories; no MDX or frontend code is required. Excel input
will follow when the category templates and converter are available.
Do not duplicate one accessory under multiple products. Record applicability
by product, hardware revision and, where relevant, tested software baseline.

The website integration contract is described in [CONTENT-CONTRACT.md](CONTENT-CONTRACT.md).

## Local website

```bash
npm ci --ignore-scripts
npm run start                 # http://127.0.0.1:8042/
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:site
```

`scripts/prepare-site.mjs` builds `site/.generated/` from the source map. Do not
edit generated pages. `HARDWARE_BASE_URL` sets the hosting subpath;
`DOCUMENTATION_URL` and `DEVELOPER_PORTAL_URL` select the matching software site
and portal. Production build output is `site/build/`.

## Contribution and permissions

Anyone can fork this public repository and submit a pull request to `master`.
Only repository administrators can update upstream branches, merge pull
requests or create tags. Administrators must also use a PR and pass the
`commit-message` and `ci` checks for `master` changes.

Read [CONTRIBUTING.md](CONTRIBUTING.md). Enable local checks with:

```bash
git config core.hooksPath .githooks
```

Product usage questions belong in the [community forum](https://community.inhand.com).
See [SECURITY.md](SECURITY.md) for sensitive reports.

## Releases

An administrator pushes an annotated tag `V<major>.<minor>.<patch>` or
`V<major>.<minor>.<patch>-rc<n>` pointing to a commit on `master`.
The workflow reruns CI, generates English and Chinese changelogs, and publishes:

- A versioned source/material archive.
- A deployable static-site archive, `mo-hardware-site-<tag>.tar.gz`.
- A SHA-256 file inventory (`manifest.json`) with the source commit.
- An SPDX SBOM for the repository distribution, not the physical board BOM.
- English and Chinese changelogs and `SHA256SUMS`.

The Release title is the tag alone. RC tags create prereleases and do not
replace the latest stable release. Published tags are immutable.
After publication, tags deploy the static-site archive to the test platform's
`/hardware-docs/` URL through the restricted `deploy-hardware` command. CI checks
checksums and the deployed version; a failed smoke check invokes rollback.
Deployment secrets must be configured; missing credentials fail the job.
The production platform is not configured, and RCs never deploy to production.
Routine hardware updates do not rebuild mo-docs. Its legacy hardware pages
redirect to the corresponding hardware URLs, preserving fragments.
GitHub Pages is a full-site PR preview; see [test/README.md](test/README.md).
Repository release versions are separate from PCB and document revisions.

## License

Original documentation and material are licensed under
[Creative Commons Attribution-ShareAlike 4.0 International](LICENSE),
the same license used by mo-docs, unless explicitly stated otherwise.
Third-party material retains its own license and notices; use an official
link when redistribution permission is unavailable. This license does not
grant patent or trademark rights or establish hardware certification.

Website dependencies, fonts, markdown-it and their dependencies retain the licenses
shipped by their respective packages; they are not relicensed under CC BY-SA.
