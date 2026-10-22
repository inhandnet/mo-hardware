import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildPreview, renderMarkdown} from '../test/build-preview.mjs';

test('Markdown renders tables and escapes raw HTML and script URLs', () => {
  const html = renderMarkdown('<script>alert(1)</script>\n\n[bad](javascript:alert(1))\n\n| A | B |\n|---|---|\n| a | b |');
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('href="javascript:'));
  assert.match(html, /<table style=/);
});

test('preview only publishes data and labels empty Mo68A', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mo-hardware-preview-test-'));
  const source = path.join(root, 'source');
  const output = path.join(root, 'preview');
  fs.mkdirSync(path.join(source, 'products/mo68a'), {recursive: true});
  fs.mkdirSync(path.join(source, 'accessories/a/files'), {recursive: true});
  fs.writeFileSync(path.join(source, 'README.md'),
    '# Review\n\n[record](accessories/a/description.en-US.md)\n\n[source](.github/workflows/ci.yml)\n\n[license](LICENSE)');
  fs.writeFileSync(path.join(source, 'LICENSE'), 'License fixture');
  fs.mkdirSync(path.join(source, 'test'));
  fs.writeFileSync(path.join(source, 'test/README.md'), '# Preview instructions');
  fs.writeFileSync(path.join(source, 'accessories/a/description.en-US.md'), '# Accessory\n\n[file](files/reference.txt)');
  fs.writeFileSync(path.join(source, 'accessories/a/files/reference.txt'), 'reference');
  fs.writeFileSync(path.join(source, 'accessories/a/files/untrusted.html'), '<script>alert(1)</script>');
  fs.symlinkSync(path.join(source, 'README.md'), path.join(source, 'accessories/a/files/link.txt'));
  const result = buildPreview(source, output, 'PR #1 / test');
  assert.deepEqual(result, {documents: 3, attachments: 2});
  assert.match(fs.readFileSync(path.join(output, 'index.html'), 'utf8'), /mo68a: no published records/);
  assert.match(fs.readFileSync(path.join(output, 'README.md.html'), 'utf8'), /accessories\/a\/description.en-US.md.html/);
  assert.match(fs.readFileSync(path.join(output, 'README.md.html'), 'utf8'),
    /https:\/\/github.com\/inhandnet\/mo-hardware\/blob\/master\/\.github\/workflows\/ci.yml/);
  assert.ok(fs.existsSync(path.join(output, 'LICENSE')));
  assert.ok(fs.existsSync(path.join(output, 'test/README.md.html')));
  assert.ok(!fs.existsSync(path.join(output, 'accessories/a/files/untrusted.html')));
  assert.ok(!fs.existsSync(path.join(output, 'accessories/a/files/link.txt')));
  // Remove only the fresh test fixture owned by this test.
  fs.rmSync(root, {recursive: true});
});
