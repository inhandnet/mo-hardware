#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {validateContentMap} from './lib/content-map.mjs';

export const productDirectories = [
  'images', 'interfaces', 'schematics', 'pcb', 'mechanical', 'revisions',
  'validation/power-thermal', 'validation/interfaces', 'compliance',
];

export function trackedFiles(root = process.cwd()) {
  return execFileSync('git', ['ls-files', '-z'], {cwd: root, encoding: 'utf8'})
    .split('\0').filter(Boolean).sort();
}

export function inspectFile(name, bytes, mode = 0o100644) {
  const errors = [];
  if ((mode & 0o170000) !== 0o100000) errors.push('only regular files are allowed');
  if (bytes.length > 50 * 1024 * 1024) errors.push('file exceeds the 50 MiB repository limit');
  if (bytes.subarray(0, 100).toString().startsWith('version https://git-lfs.github.com/spec/v1')) {
    errors.push('Git LFS pointer found instead of attachment bytes');
  }
  if (/\.(mdx|xlsm)$/i.test(name)) errors.push('MDX and macro-enabled workbooks are not accepted');
  if (/(^|\/)~\$/.test(name)) errors.push('temporary office file');
  if (/(^|\/)(\.env(?:\..*)?|id_rsa|id_ed25519)$/.test(name)) errors.push('credential-like file name');
  if (/\.(md|txt|json|ya?ml|csv|mjs|sh)$/i.test(name)) {
    const text = bytes.toString('utf8');
    if (/-----BEGIN (?:OPENSSH |RSA |EC |DSA )?PRIVATE KEY-----/.test(text)) {
      errors.push('private key marker');
    }
    if (/https?:\/\/[^\s<>"']+[?&]X-Amz-(?:Signature|Credential)=/i.test(text)) {
      errors.push('temporary signed download URL');
    }
  }
  return errors.map(error => `${name}: ${error}`);
}

export function checkContent(root = process.cwd()) {
  const files = trackedFiles(root);
  const errors = [];
  for (const name of files) {
    const filename = path.join(root, name);
    const stat = fs.lstatSync(filename);
    if (!stat.isFile()) errors.push(`${name}: only regular files are allowed`);
    else errors.push(...inspectFile(name, fs.readFileSync(filename), stat.mode));
    if (/^products\//.test(name) && !/^products\/(mo62a|mo68a)\//.test(name)) {
      errors.push(`${name}: product is not registered in this foundation`);
    }
    if (name.startsWith('products/mo68a/') && !name.endsWith('/.gitkeep')) {
      errors.push(`${name}: Mo68A must remain empty until explicitly enabled`);
    }
  }
  for (const product of ['mo62a', 'mo68a']) {
    for (const directory of productDirectories) {
      const prefix = `products/${product}/${directory}/`;
      if (!files.some(name => name.startsWith(prefix))) errors.push(`missing directory: ${prefix}`);
    }
  }
  for (const required of ['LICENSE', 'README.md', 'README.zh-CN.md', 'CONTRIBUTING.md',
    'SECURITY.md', 'CONTENT-CONTRACT.md', 'release-notes/changelog-baseline']) {
    if (!files.includes(required)) errors.push(`missing required file: ${required}`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  validateContentMap(root, JSON.parse(fs.readFileSync(path.join(root, 'site/content-map.json'), 'utf8')));
  return files;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const files = checkContent();
    console.log(`Validated ${files.length} tracked files and both product skeletons.`);
    console.log('Workbook semantics and hardware claims require separate review.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
