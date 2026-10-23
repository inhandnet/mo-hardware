#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {git, parseVersion, policy} from './lib/policy.mjs';

export function validateRelease(tag) {
  parseVersion(tag);
  if (git('cat-file', '-t', `refs/tags/${tag}`) !== 'tag') throw new Error('Use an annotated tag.');
  const commit = git('rev-parse', `refs/tags/${tag}^{commit}`);
  if (commit !== git('rev-parse', 'HEAD')) throw new Error('Checkout must match the tag commit.');
  git('merge-base', '--is-ancestor', commit, `refs/remotes/origin/${policy.defaultBranch}`);
  execFileSync('node', ['scripts/check-commit-msg.mjs', '--revs', '-1', commit], {stdio: 'inherit'});
  return commit;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { console.log(`Validated ${process.argv[2]} at ${validateRelease(process.argv[2])}`); }
  catch (error) { console.error(`Release policy: ${error.message}`); process.exitCode = 1; }
}
