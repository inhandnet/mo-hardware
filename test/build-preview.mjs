#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import MarkdownIt from 'markdown-it';

function createMarkdown() {
  const renderer = new MarkdownIt({html: false, linkify: false});
  renderer.renderer.rules.table_open = (tokens, index) => {
    let columns = 0;
    let width = 16;
    for (let i = index + 1; i < tokens.length && tokens[i].type !== 'table_close'; i++) {
      if (tokens[i].type === 'th_open') columns++;
      if (tokens[i].type === 'inline') {
        for (const word of tokens[i].content.split(/\s+/)) width = Math.max(width, word.length);
      }
    }
    const minimum = Math.ceil(Math.max(columns, 1) * (width * 10 + 30));
    return `<div class="table-scroll"><table style="min-width:${minimum}px">\n`;
  };
  renderer.renderer.rules.table_close = () => '</table></div>\n';
  return renderer;
}
const markdown = createMarkdown();
const attachmentExtensions = new Set(['.pdf', '.step', '.stp', '.dxf', '.zip', '.xlsx', '.csv', '.json',
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.txt']);
const escape = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));
const urlPath = value => value.split('/').map(encodeURIComponent).join('/');

export function renderMarkdown(text) {
  return markdown.render(text);
}

export function buildPreview(source, output, label) {
  source = path.resolve(source);
  output = path.resolve(output);
  if (output === source) throw new Error('preview output must not replace its source');
  fs.mkdirSync(output, {recursive: true});
  const files = [];
  function walk(directory, relative = '') {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      if (entry.name.startsWith('.') || ['node_modules', 'dist', 'scripts', 'tests', 'test', 'release-notes'].includes(entry.name)) continue;
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      const filename = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (relative || ['products', 'accessories', 'templates'].includes(entry.name)) walk(filename, name);
      } else if (entry.isFile() && (relative || /\.md$/i.test(name))) {
        if (fs.statSync(filename).size > 50 * 1024 * 1024) throw new Error(`oversize preview file: ${name}`);
        files.push(name);
      }
    }
  }
  walk(source);
  for (const name of ['LICENSE', 'test/README.md']) {
    const filename = path.join(source, name);
    if (fs.existsSync(filename) && fs.lstatSync(filename).isFile()) files.push(name);
  }
  const documents = files.filter(name => name.endsWith('.md')).sort();
  const attachments = files.filter(name => name === 'LICENSE' ||
    attachmentExtensions.has(path.extname(name).toLowerCase())).sort();
  const copied = new Set(attachments);
  const documentSet = new Set(documents);
  const sourceRef = label.match(/\b[0-9a-f]{40}\b/)?.[0] ?? 'master';
  const policy = "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'";
  const styles = 'body{max-width:1050px;margin:auto;padding:24px;font:18px/1.55 system-ui;color:#222}' +
    'nav,aside{background:#f7f8fa;padding:16px;border-radius:8px}a{color:#007438}' +
    '.table-scroll{overflow-x:auto}table{border-collapse:collapse;table-layout:fixed;width:100%}' +
    'td,th{border:1px solid #dcdfe3;padding:8px;word-break:normal;overflow-wrap:normal}' +
    'pre{overflow:auto;padding:12px;background:#f5f7f9}img{max-width:100%}code{white-space:pre-wrap}' +
    '.meta{overflow-wrap:anywhere}';
  function page(title, content, back = '') {
    return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      `<meta http-equiv="Content-Security-Policy" content="${escape(policy)}">` +
      `<title>${escape(title)}</title><style>${styles}</style></head><body>` +
      `<aside class="meta">Engineering preview — ${escape(label)}. Not a product release.</aside>` +
      (back ? `<nav><a href="${back}">All material</a></nav>` : '') + content + '</body></html>';
  }
  for (const name of documents) {
    const localMarkdown = createMarkdown();
    const filename = path.join(source, name);
    if (fs.statSync(filename).size > 2 * 1024 * 1024) throw new Error(`oversize Markdown: ${name}`);
    const tokens = localMarkdown.parse(fs.readFileSync(filename, 'utf8'), {});
    function rewrite(tokens) {
      for (const token of tokens) {
        for (const attr of ['href', 'src']) {
          const value = token.attrGet(attr);
          if (value && !/^(?:[a-z]+:|\/\/|#)/i.test(value)) {
            const [filePart, fragment] = value.split('#');
            const target = path.posix.normalize(path.posix.join(path.posix.dirname(name), filePart));
            if (documentSet.has(target) || copied.has(target)) {
              const targetOutput = documentSet.has(target) ? `${target}.html` : target;
              const relative = path.posix.relative(path.posix.dirname(name), targetOutput);
              token.attrSet(attr, urlPath(relative) + (fragment ? '#' + encodeURIComponent(fragment) : ''));
            } else {
              token.attrSet(attr, 'https://github.com/inhandnet/mo-hardware/blob/' +
                sourceRef + '/' + urlPath(target) + (fragment ? '#' + encodeURIComponent(fragment) : ''));
            }
          }
        }
        if (token.children) rewrite(token.children);
      }
    }
    rewrite(tokens);
    const destination = path.join(output, name + '.html');
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    const back = urlPath(path.posix.relative(path.posix.dirname(name), 'index.html'));
    fs.writeFileSync(destination, page(name, localMarkdown.renderer.render(tokens, localMarkdown.options, {}), back));
  }
  for (const name of attachments) {
    const destination = path.join(output, name);
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.copyFileSync(path.join(source, name), destination);
  }
  const productStatus = ['mo62a', 'mo68a'].map(product => {
    const count = files.filter(name => name.startsWith(`products/${product}/`)).length;
    return `<li>${escape(product)}: ${count ? `${count} source files; review their validation scope` : 'no published records (empty placeholder)'}</li>`;
  }).join('');
  const list = documents.map(name => `<li><a href="${urlPath(name)}.html">${escape(name)}</a></li>`).join('');
  const downloads = attachments.map(name => `<li><a href="${urlPath(name)}" download>${escape(name)}</a></li>`).join('');
  fs.writeFileSync(path.join(output, 'index.html'), page('Mo hardware review',
    `<h1>Mo hardware review</h1><p>Material preview for the planned independent hardware site.</p>` +
    `<h2>Product records</h2><ul>${productStatus}</ul><h2>Documents</h2><ul>${list}</ul>` +
    `<h2>Attachments</h2>${attachments.length ? `<ul>${downloads}</ul>` : '<p>No attachments provided.</p>'}`));
  return {documents: documents.length, attachments: attachments.length};
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const values = {};
  for (let i = 2; i < process.argv.length; i += 2) values[process.argv[i]] = process.argv[i + 1];
  if (!values['--source'] || !values['--output'] || !values['--label']) {
    throw new Error('usage: build-preview.mjs --source DIR --output DIR --label LABEL');
  }
  console.log(buildPreview(values['--source'], values['--output'], values['--label']));
}
