import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

export default function deploymentPlugin({siteConfig, siteDir}) {
  return {
    name: 'hardware-deployment-marker',
    async postBuild({outDir}) {
      const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
        cwd: siteDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
      const marker = {
        version: process.env.TAG || 'preview', commit,
        repository: 'inhandnet/mo-hardware',
        environment: process.env.HARDWARE_ENVIRONMENT || 'local',
        site_url: siteConfig.url, base_url: siteConfig.baseUrl,
      };
      await fs.writeFile(path.join(outDir, 'deployment.json'), JSON.stringify(marker) + '\n');
    },
  };
}
