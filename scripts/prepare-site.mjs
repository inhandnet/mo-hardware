import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateContentMap} from './lib/content-map.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const map=validateContentMap(root,JSON.parse(fs.readFileSync(path.join(root,'site/content-map.json'),'utf8')));
const generated=path.join(root,'site/.generated');
// Only this build-owned directory is replaced; source material is never changed.
fs.rmSync(generated,{recursive:true,force:true});
fs.mkdirSync(path.join(generated,'docs'),{recursive:true});
fs.mkdirSync(path.join(generated,'static'),{recursive:true});
const docsURL=(process.env.DOCUMENTATION_URL??'https://inhandnet.github.io/mo-docs').replace(/\/$/,'');
for(const record of map.routes){
  const source=path.resolve(root,record.source);
  if(!source.startsWith(root+path.sep))throw new Error('Source outside repository');
  let content=fs.readFileSync(source,'utf8');
  // External software links must be concrete at build time for broken-link checks.
  content=content.replace(/\]\(\/docs(\/[^)]*)\)/g,(_,suffix)=>`](${docsURL}${suffix})`);
  content=content.replace(/^---\r?\n/,'---\nslug: /'+record.route+'\n');
  const destination=path.join(generated,'docs',record.original.replace(/^docs\//,'').replace(/\.mdx$/,'.md'));
  fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,content);
}
fs.writeFileSync(path.join(generated,'docs/index.md'),
  fs.readFileSync(path.join(root,'site/content/index.md'),'utf8').replaceAll('](/docs/)',`](${docsURL}/)`));
for(const board of ['mo-62a','mo-68a']){
  const name=board==='mo-62a'?'Mo 62A':'Mo 68A';
  const content=`---\ntitle: ${name}\nslug: /${board}/\n---\n\n`+
    `- [Hardware development](/${board}/hardware-development/)\n`+
    `- [Accessories](/${board}/accessories/)\n- [Compliance](/${board}/compliance/)\n`+
    `- [Software documentation](${docsURL}/${board}/)\n`;
  fs.writeFileSync(path.join(generated,`docs/${board}/index.md`),content);
}
for(const asset of map.assets){
  const source=path.resolve(root,asset.source),destination=path.resolve(generated,'static',asset.target);
  if(!source.startsWith(root+path.sep)||!destination.startsWith(generated+path.sep))throw new Error('Unsafe asset path');
  fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(source,destination);
}
console.log(`Prepared ${map.routes.length+3} pages and ${map.assets.length} media/download assets.`);
