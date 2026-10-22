#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {checkContent} from './check-content.mjs';

export function buildManifest(root, version) {
  if (!/^V(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-rc[1-9]\d*)?$/.test(version)) {
    throw new Error('invalid version: expected VX.Y.Z or VX.Y.Z-rcN');
  }
  const names = checkContent(root);
  return {
    schema_version: 1,
    repository: 'inhandnet/mo-hardware',
    version,
    source_commit: execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim(),
    content_status: 'scaffold',
    records: [],
    files: names.filter(name => !name.endsWith('/.gitkeep')).map(name => {
      const data = fs.readFileSync(path.join(root, name));
      return {path: name, size_bytes: data.length, sha256: createHash('sha256').update(data).digest('hex')};
    }),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [version, output] = process.argv.slice(2);
    if (!output) throw new Error('usage: build-manifest.mjs VERSION OUTPUT');
    const manifest = buildManifest(process.cwd(), version);
    fs.mkdirSync(path.dirname(output), {recursive: true});
    fs.writeFileSync(output, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Built ${manifest.files.length} file entries; no validated hardware records.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
