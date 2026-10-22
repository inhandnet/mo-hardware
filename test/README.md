# Hardware material preview

This is an engineering review renderer for the planned independent hardware site.
It displays Markdown and download links for accepted file types, and labels
empty product directories as having no published records. Excel files are
downloadable; worksheet semantics and charts await the content templates.

```bash
npm ci
node test/build-preview.mjs --source . --output dist/preview --label local
python3 -m http.server 8041 --directory dist/preview
```

Do not use port 8040, which is reserved for the existing mo-docs review.

The Pages workflow uses the renderer from the trusted default branch and reads
PR content as data. It does not run the PR's renderer, install its dependencies,
or execute its scripts. The render job has read-only permissions; a separate
job deploys the generated static artifact to GitHub Pages.

GitHub Pages shows the most recently rendered successful PR preview. It is a
single review slot, not a permanent per-PR archive. The page identifies its PR
and source commit. Every successful PR CI run triggers the preview workflow;
first-time fork workflows may require the GitHub administrator approval.
Concurrent deployments are serialized. The downloaded workflow artifact is
also available for seven days, independently of the Pages slot.

Only material and documentation are previewed. A strict content security policy,
escaped raw HTML and link validation limit active content. SVG, HTML, JavaScript,
macro workbooks and other executable attachments are not published by this preview.
The attachment allowlist is independent of the eventual production asset policy.
