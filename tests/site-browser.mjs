import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {checkAllTables} from './table-layout.mjs';

const root = path.resolve('site/build');
const map = JSON.parse(fs.readFileSync('site/content-map.json', 'utf8'));
const base = process.env.HARDWARE_BASE_URL ?? '/';
const types = {'.html':'text/html', '.js':'application/javascript', '.css':'text/css',
  '.svg':'image/svg+xml', '.png':'image/png', '.json':'application/json', '.woff2':'font/woff2'};
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) {res.writeHead(404).end(); return;}
  let name = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
  if (name !== root && !name.startsWith(root + path.sep)) {res.writeHead(403).end(); return;}
  if (fs.existsSync(name) && fs.statSync(name).isDirectory()) name = path.join(name, 'index.html');
  if (!fs.existsSync(name)) {res.writeHead(404).end(); return;}
  if (url.pathname.endsWith('/') && fs.statSync(name).isFile() && !name.endsWith('/index.html')) {
    res.writeHead(404).end(); return;
  }
  res.setHeader('Content-Type', types[path.extname(name)] ?? 'application/octet-stream');
  fs.createReadStream(name).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless: true});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const routes = ['', 'mo-62a/', 'mo-68a/', ...map.routes.map(r => r.route)];
const links = new Set();
let images = 0;
try {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({width, height: 1000});
    for (const route of routes) {
      const response = await page.goto(origin + base + route, {waitUntil:'networkidle'});
      assert.equal(response.status(), 200, route);
      await page.locator('h1').first().waitFor();
      // Scroll through lazy-loaded figures before testing their decoded sizes.
      await page.locator('article img').evaluateAll(async elements => {
        for (const img of elements) {img.loading = 'eager'; await img.decode();}
      });
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 2,
        images: [...document.querySelectorAll('article img')].map(i => ({src:i.src, ok:i.naturalWidth > 0})),
        links: [...document.querySelectorAll('a[href]')].map(a => a.href),
        tables: [...document.querySelectorAll('article table')].map(t => ({
          layout:getComputedStyle(t).tableLayout,
          cells:[...t.querySelectorAll('th,td')].map(c => ({
            text:c.textContent, wordBreak:getComputedStyle(c).wordBreak,
          })),
        })),
      }));
      assert.equal(result.overflow, false, `page overflow: ${width} ${route}`);
      for (const i of result.images) assert.ok(i.ok, i.src);
      for (const table of result.tables) {
        assert.equal(table.layout, 'fixed', route);
        for (const cell of table.cells) assert.notEqual(cell.wordBreak, 'break-all', cell.text);
      }
      if (width === 1440) {
        images += result.images.length;
        result.links.filter(href => href.startsWith(origin + base)).forEach(href => links.add(href));
      }
    }
  }
  // Verify each local URL and fragment, including links inherited from source pages.
  const documents = new Map();
  for (const link of links) {
    assert.ok(!/\.(svg|png|jpe?g|gif|webp|pdf|zip|txt|json)\/(?:[?#]|$)/i.test(link), link);
    const url = new URL(link);
    const response = await fetch(url);
    assert.equal(response.status, 200, link);
    if (url.hash && response.headers.get('content-type')?.startsWith('text/html')) {
      const key = url.pathname;
      if (!documents.has(key)) documents.set(key, await response.text());
      assert.ok(documents.get(key).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), link);
    }
  }
  for (const asset of map.assets) {
    const downloaded = Buffer.from(await (await fetch(origin + base + asset.target)).arrayBuffer());
    assert.equal(createHash('sha256').update(downloaded).digest('hex'),
      createHash('sha256').update(fs.readFileSync(asset.source)).digest('hex'), asset.target);
  }
  await page.goto(origin + base + 'mo-62a/hardware-development/overview/');
  const search = page.getByRole('button', {name:/search/i}).first();
  await search.click();
  const input = page.getByRole('searchbox');
  await input.fill('schematics');
  await page.locator('.search-results a').first().waitFor({timeout:10000});
  await checkAllTables(page, root, origin + base);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({pages:routes.length, widths:[390,768,1440], images,
    localLinks:links.size, assets:map.assets.length, search:'passed'}));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
