// Renders every slide of carousel.html to Exports/<set dir>/NN.jpg (1080x1350, Instagram 4:5).
// Usage: node creatine-clip/thumbnails/carousel.js [bro|ul]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SET = process.argv[2] || 'bro';
const OUT = path.resolve(__dirname, '..', '..', 'Exports', { bro: 'bro-split-carousel', ul: 'upper-lower-carousel' }[SET]);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  let n = 1;
  for (let s = 1; s <= n; s++) {
    await page.goto(`file://${path.join(__dirname, 'carousel.html')}?set=${SET}&slide=${s}`);
    await page.evaluate(() => window.ready);
    n = await page.evaluate(() => window.N);
    const file = path.join(OUT, `${String(s).padStart(2, '0')}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 94 });
    console.log('wrote ' + file);
  }
  await browser.close();
})();
