import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {inspectFile} from '../scripts/check-content.mjs';
import {buildManifest} from '../scripts/build-manifest.mjs';
import {parseCommitMessage, renderChangelog} from '../scripts/generate-changelog.mjs';

test('reject pointers, unsupported formats and signed attachment links', () => {
  const pointer = Buffer.from('version https://git-lfs.github.com/spec/v1\noid sha256:example');
  assert.match(inspectFile('files/board.step', pointer).join(), /pointer/);
  assert.match(inspectFile('description.mdx', Buffer.from('text')).join(), /MDX/);
  assert.match(inspectFile('record.xlsm', Buffer.from('data')).join(), /macro/);
  const signedLink = 'https://example.invalid/a?' + 'X-Amz-Signature=example';
  assert.match(inspectFile('links.md', Buffer.from(signedLink)).join(), /signed/);
  assert.deepEqual(inspectFile('links.md', Buffer.from('https://example.invalid/stable.pdf')), []);
});

test('reject private keys without printing their contents', () => {
  const marker = ['-----BEGIN ', 'OPENSSH ', 'PRIVATE KEY-----'].join('');
  assert.match(inspectFile('notes.md', Buffer.from(marker)).join(), /private key marker/);
});

test('manifest preserves actual hashes and does not advertise placeholder products', () => {
  const manifest = buildManifest(process.cwd(), 'V1.0.1-rc1');
  assert.equal(manifest.content_status, 'scaffold');
  assert.deepEqual(manifest.records, []);
  assert.ok(manifest.files.length > 0);
  for (const entry of manifest.files) {
    const data = fs.readFileSync(entry.path);
    assert.equal(entry.size_bytes, data.length);
    assert.equal(entry.sha256, createHash('sha256').update(data).digest('hex'));
    assert.ok(!entry.path.endsWith('.gitkeep'));
  }
  assert.throws(() => buildManifest(process.cwd(), 'V1.0.1-rc0'), /invalid version/);
  assert.throws(() => buildManifest(process.cwd(), '../V1.0.1'), /invalid version/);
});

test('bilingual changelog describes hardware and rejects missing translations', () => {
  const message = 'docs: add hardware reference\n\nMessage:\n  en: Add hardware reference.\n  zh: 增加硬件参考。';
  const commit = parseCommitMessage(message, '0123456789abcdef');
  assert.match(renderChangelog('V1.0.1-rc1', [commit], 'en'), /Mo hardware/);
  assert.match(renderChangelog('V1.0.1-rc1', [commit], 'zh'), /增加硬件参考/);
  assert.throws(() => parseCommitMessage('docs: add reference\n\nMessage:\n  en: Only English.'), /en and zh/);
});
