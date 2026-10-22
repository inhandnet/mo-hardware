# Hardware previews

GitHub Pages uses the same full Docusaurus site as releases. Pull-request CI
builds and tests with read-only permissions and no deployment secrets. After
successful CI, a workflow on the default branch downloads the static artifact;
the separate Pages deployment job does not install or execute PR code.

Pages is a single latest-successful-PR preview slot, not a release platform.
The preview banner identifies the PR/build; artifacts remain available for
seven days. Fork workflows may require GitHub administrator approval.
A manual Pages dispatch builds trusted master with the same templates.

For the full local site, use `npm run start` on port 8042. Do not use 8040,
which is reserved for the existing software-documentation review.

The old lightweight Markdown/download index remains optional:

```bash
node test/build-preview.mjs --source . --output dist/preview --label local
python3 -m http.server 8041 --directory dist/preview
```

This auxiliary renderer escapes raw HTML and rejects active attachments.
It is useful for inspecting material directories, not for website acceptance.
Excel files are downloads only until workbook templates and conversion exist.
