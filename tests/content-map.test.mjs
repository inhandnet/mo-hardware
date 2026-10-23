import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validateContentMap} from '../scripts/lib/content-map.mjs';

test('content maps reject traversal, collisions, missing files and malformed front matter', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hardware-map-'));
  try {
    fs.writeFileSync(path.join(root, 'page.md'), '---\r\ntitle: Example\r\n---\r\nExample.');
    fs.writeFileSync(path.join(root, 'file.txt'), 'attachment');
    const fixture = () => ({schema_version: 1, routes: [{source: 'page.md', route: 'test/example/', original: 'docs/test/example.mdx'}], assets: [{source: 'file.txt', target: 'downloads/example.txt'}]});
    assert.doesNotThrow(() => validateContentMap(root, fixture()));
    for (const change of [
      m => {m.routes[0].original = 'docs/../../README.mdx';},
      m => {m.routes[0].route = '../example/';},
      m => {m.routes.push({...m.routes[0]});},
      m => {m.assets[0].target = 'downloads/../index.html';},
      m => {m.assets.push({...m.assets[0]});},
      m => {m.routes[0].source = 'missing.md';},
      m => {m.routes[0].original = 'docs/index.mdx';},
    ]) {
      const map = fixture(); change(map);
      assert.throws(() => validateContentMap(root, map));
    }
    fs.writeFileSync(path.join(root, 'page.md'), '# Missing metadata');
    assert.throws(() => validateContentMap(root, fixture()), /front matter/);
  } finally {fs.rmSync(root, {recursive: true, force: true});}
});
