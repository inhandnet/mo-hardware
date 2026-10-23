import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {policy} from '../scripts/lib/policy.mjs';
import deploymentPlugin from '../site/plugins/deployment.mjs';

test('release validation rejects lightweight, off-master and mismatched checkout tags', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hardware-release-'));
  try {
    for (const name of ['scripts/check-release.mjs', 'scripts/check-commit-msg.mjs', 'scripts/lib/policy.mjs']) {
      fs.mkdirSync(path.dirname(path.join(root, name)), {recursive: true});
      fs.copyFileSync(new URL(`../${name}`, import.meta.url), path.join(root, name));
    }
    const run = (command, args) => spawnSync(command, args, {cwd: root, encoding: 'utf8'});
    const git = (...args) => {
      const result = run('git', args); assert.equal(result.status, 0, result.stderr); return result.stdout.trim();
    };
    git('init', '-q', '-b', 'master');
    git('config', 'user.name', 'Release fixture'); git('config', 'user.email', 'fixture@example.invalid');
    git('config', 'commit.gpgsign', 'false'); git('config', 'tag.gpgsign', 'false');
    git('commit', '--allow-empty', '-m', 'Legacy baseline');
    fs.mkdirSync(path.join(root, 'config'));
    fs.writeFileSync(path.join(root, 'config/repository-policy.json'), JSON.stringify({...policy, legacyBoundary: git('rev-parse', 'HEAD')}));
    git('commit', '--allow-empty', '-m', 'docs: record the release input');
    git('update-ref', 'refs/remotes/origin/master', 'HEAD');
    git('tag', '-a', 'V1.0.0-rc1', '-m', 'V1.0.0-rc1');
    const check = tag => run(process.execPath, ['scripts/check-release.mjs', tag]);
    assert.equal(check('V1.0.0-rc1').status, 0);
    git('tag', 'V1.0.0-rc2');
    assert.match(check('V1.0.0-rc2').stderr, /annotated/);
    assert.notEqual(check('invalid-tag').status, 0);
    git('switch', '-q', '-c', 'topic'); git('commit', '--allow-empty', '-m', 'docs: change a topic');
    git('tag', '-a', 'V1.0.0-rc3', '-m', 'V1.0.0-rc3');
    assert.notEqual(check('V1.0.0-rc3').status, 0);
    assert.match(check('V1.0.0-rc1').stderr, /Checkout/);
  } finally {fs.rmSync(root, {recursive: true, force: true});}
});

test('deployment marker records the built repository commit and selected base', async () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'hardware-marker-'));
  const previous = Object.fromEntries(['TAG', 'HARDWARE_ENVIRONMENT'].map(key => [key, process.env[key]]));
  try {
    process.env.TAG = 'V1.0.0-rc1'; process.env.HARDWARE_ENVIRONMENT = 'test';
    await deploymentPlugin({siteDir: new URL('../site/', import.meta.url).pathname,
      siteConfig: {url: 'https://example.invalid', baseUrl: '/hardware-docs/'}}).postBuild({outDir: output});
    const marker = JSON.parse(fs.readFileSync(path.join(output, 'deployment.json')));
    assert.equal(marker.version, 'V1.0.0-rc1'); assert.equal(marker.environment, 'test');
    assert.equal(marker.base_url, '/hardware-docs/'); assert.equal(marker.site_url, 'https://example.invalid');
    assert.match(marker.commit, /^[a-f0-9]{40}$/);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    fs.rmSync(output, {recursive: true, force: true});
  }
});
