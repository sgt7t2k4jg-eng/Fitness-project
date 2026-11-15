// Renders the video frame by frame with headless Chromium, then encodes with ffmpeg.
//   node tools/render.js                      -> out/carbs.mp4 (silent)
//   node tools/render.js --audio voice.mp3    -> muxes the voiceover in
//   node tools/render.js --shots 3,12.5,40    -> PNG stills only (for review)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : null; };
const FPS = 30, WORKERS = 4;
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'out');
const url = 'file://' + path.join(root, 'src/index.html') + '?render';

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const open = async () => {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => { console.error('PAGE ERROR:', e.message); process.exit(1); });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    return page;
  };

  if (opt('shots')) {
    const page = await open();
    const dir = opt('dir') || path.join(outDir, 'shots');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of opt('shots').split(',').map(Number)) {
      await page.evaluate((x) => window.seek(x), t);
      await page.screenshot({ path: path.join(dir, `t${t.toFixed(1).padStart(6, '0')}.png`) });
    }
    await browser.close();
    return;
  }

  const frames = fs.mkdtempSync(path.join(os.tmpdir(), 'carbs-frames-'));
  const first = await open();
  const duration = await first.evaluate(() => window.VIDEO.duration);
  const total = Math.ceil(duration * FPS);
  const pages = [first, ...(await Promise.all(Array.from({ length: WORKERS - 1 }, open)))];
  let done = 0;
  await Promise.all(pages.map(async (page, k) => {
    for (let f = k; f < total; f += WORKERS) {
      await page.evaluate((x) => window.seek(x), f / FPS);
      await page.screenshot({ path: path.join(frames, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
      if (++done % 300 === 0) console.log(`${done}/${total} frames`);
    }
  }));
  await browser.close();

  const audio = opt('audio');
  const out = path.join(outDir, 'carbs.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.jpg'),
    ...(audio ? ['-i', audio, '-c:a', 'aac', '-b:a', '192k'] : []),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(frames, { recursive: true, force: true });
  console.log(`Wrote ${out} (${duration.toFixed(1)}s, ${total} frames)`);
})();
