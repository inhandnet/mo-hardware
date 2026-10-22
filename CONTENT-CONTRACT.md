# Hardware content and website contract

This document fixes directory responsibilities. The hardware site will build
and publish independently; mo-docs retains software tutorials and navigation
links to hardware pages. The first site migration uses ordinary Markdown and
approved attachments; it is not a completed Excel parser or validation catalog.
Mo62A content is populated. Mo68A product records remain empty while inherited
website references preserve the existing mo-docs text and placeholder status.

## Hardware page mapping

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

The Release exports source and static-site archives plus `manifest.json`
with hashes, sizes, source revision and `content_status: migrated-reference`.
The inherited page list records the original repository and commit. Empty
`records` means no new structured validation records, not an absence of pages.
`schema_version` versions this
inventory format; it is not the future workbook schema version.

A later implementation will validate workbooks and export structured JSON/CSV.
PR previews and release builds now use the same production templates.
mo-docs links to stable hardware page URLs; routine hardware releases do not
require rebuilding mo-docs. Preserve old page/anchor links during migration.
Empty Mo68A directories must not produce new supported-product claims.

The optional `test/` material index is not used as the main Pages site. Pages
publishes the full website from read-only CI artifacts; the privileged deploy
job does not execute PR code. Test releases deploy independently under the
portal's `/hardware-docs/` URL; RCs never go to production. The server confines
the action to the hardware subdirectory, stages archives, activates atomically
and retains a rollback copy. Static replacement needs no developer restart.
The future production platform is not configured.

Large files should eventually use versioned release/object-storage attachments.
For now, committed files must be at most 50 MiB and must contain actual bytes,
not Git LFS pointer text. Third-party documentation may use stable official
links; transient signed URLs are not permanent download locations.
