// Renders a page in this folder to Exports/<output name> (default <name>-thumbnail.jpg), 1080x1920.
// Usage: node creatine-clip/thumbnails/render.js carbs   |   node .../render.js week-plan week-plan.jpg
const path = require('path');
const { chromium } = require('playwright');

const name = process.argv[2];
if (!name) { console.error('usage: node render.js <thumbnail name>'); process.exit(1); }
const ROOT = path.resolve(__dirname, '..', '..');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, name + '.html'));
  await page.evaluate(() => window.ready);
  const out = path.join(ROOT, 'Exports', process.argv[3] || `${name}-thumbnail.jpg`);
  await page.screenshot({ path: out, type: 'jpeg', quality: 93 });
  await browser.close();
  console.log('wrote ' + out);
})();
