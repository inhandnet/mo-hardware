# mo-hardware

English | [简体中文](README.zh-CN.md)

Versioned hardware documentation and reference files for InHand Mo boards.
The hardware site is planned to publish independently with the visual style of
[mo-docs](https://github.com/inhandnet/mo-docs). Hardware contributors maintain
material; the software team maintains page templates and build automation.
This repository does not contain BSP, SDK or device application code.

## Status

Repository governance, directory placeholders, CI and tag-driven packaging are
available. Mo62A and Mo68A directories currently contain no product records.
Mo68A is reserved only. Empty folders do not establish product support.

The `test/` renderer and GitHub Pages workflow provide temporary PR material
previews. Production hardware pages, Excel templates, semantic validation,
Excel-to-data conversion and platform deployment are planned, not implemented
by this foundation release. Existing mo-docs pages have not been migrated.
Do not treat the file inventory as a validated hardware catalog.

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
| `test/` | Temporary Markdown/download preview for engineering review |
| `scripts/`, `tests/`, `.github/`, `.githooks/` | Automation maintained by the software team |

Hardware contributors will maintain Excel, Markdown and attachments in the
content directories. Long descriptions use `description.en-US.md` and
`description.zh-CN.md`; structured values belong in the category workbook.
Do not duplicate one accessory under multiple products. Record applicability
by product, hardware revision and, where relevant, tested software baseline.

The website integration contract is described in [CONTENT-CONTRACT.md](CONTENT-CONTRACT.md).

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
- A SHA-256 file inventory (`manifest.json`) with the source commit.
- An SPDX SBOM for the repository distribution, not the physical board BOM.
- English and Chinese changelogs and `SHA256SUMS`.

The Release title is the tag alone. RC tags create prereleases and do not
replace the latest stable release. Published tags are immutable.
The tag workflow does not yet deploy to a public/production platform or update
mo-docs. GitHub Pages is an engineering PR preview only; see [test/README.md](test/README.md).
Repository release versions are separate from PCB and document revisions.

## License

Original documentation and material are licensed under
[Creative Commons Attribution-ShareAlike 4.0 International](LICENSE),
the same license used by mo-docs, unless explicitly stated otherwise.
Third-party material retains its own license and notices; use an official
link when redistribution permission is unavailable. This license does not
grant patent or trademark rights or establish hardware certification.

The maintenance dependency markdown-it and its dependencies retain the licenses
shipped by their respective packages; they are not relicensed under CC BY-SA.
