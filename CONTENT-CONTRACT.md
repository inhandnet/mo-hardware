# Hardware content and website contract

This document fixes directory responsibilities. The hardware site will build
and publish independently; mo-docs retains software tutorials and navigation
links to hardware pages. This is a planned interface, not a completed Excel
parser, production website or platform deployment.
The first implementation populates Mo62A only; Mo68A remains empty.

## Hardware page mapping (planned migration from mo-docs)

| Hardware source | Hardware site page |
| --- | --- |
| Product workbook and images | Overview & specifications |
| Interfaces | Hardware interfaces |
| Schematics and PCB | Schematics and hardware design downloads |
| Mechanical | Mechanical |
| Revisions | Hardware revisions |
| Power/thermal validation | Power & thermal |
| Interface validation | Linked interface validation records |
| Compliance | Compliance |
| Shared accessories | Global Accessories and product-filtered accessory lists |

Keep Linux device names, driver setup, device-tree configuration and programming
procedures in mo-docs. Hardware installation and electrical explanations belong
with their hardware records. Software and model versions that define a test
remain part of the test record.

## Record conventions

Each category will provide a versioned Excel template and a complete example.
Independent records use stable directory IDs, a `record.xlsx`, optional long
descriptions in `description.en-US.md` and `description.zh-CN.md`, and `files/`
and `images/` attachments. Product identity uses `product.xlsx`.

Templates will define identity, template revision, bilingual display names,
document revision, date, hardware applicability and attachment references.
Publication state and validation state are separate fields. Missing evidence
must not become zero, a passing test or an implicit compatibility claim.

Accessory records are shared. Each compatibility relation identifies a product,
hardware revision and applicable software/test scope rather than duplicating
the accessory in each product directory. Stable IDs survive display-name edits.

Power and thermal templates must distinguish manual meter readings from timed
samples. Manual readings produce tables; only measured time series produce
curves. Preserve the actual sensor identities, units, timestamps and measurement
boundary. Do not infer a product maximum, thermal equilibrium or independent
MMA utilization from a short workload observation.

## Versioned handoff

The foundation Release exports a source archive and file-level `manifest.json`
with hashes, sizes, source revision and `content_status: scaffold`.
It contains no validated content records. `schema_version` versions this
inventory format; it is not the future workbook schema version.

A later implementation will validate workbooks, export structured JSON/CSV,
build hardware pages and publish them with versioned attachments. PR previews
and release builds should use the same production templates once available.
mo-docs links to stable hardware page URLs; routine hardware releases do not
require rebuilding mo-docs. Preserve old page/anchor links during migration.
Empty Mo68A directories must not produce supported-product claims or new pages.

The current `test/` renderer previews Markdown and downloads on GitHub Pages.
It is not the production site. Public test and future production deployments
will use separate targets; RC versions go only to the test platform. Static
file replacement normally needs no developer process restart. Target paths,
atomic activation, rollback and navigation integration remain to implement.

Large files should eventually use versioned release/object-storage attachments.
For now, committed files must be at most 50 MiB and must contain actual bytes,
not Git LFS pointer text. Third-party documentation may use stable official
links; transient signed URLs are not permanent download locations.
