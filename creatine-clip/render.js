// Renders index.html frame-by-frame with headless Chromium, synthesises the SFX track,
// and muxes both into Exports/creatine-01-energy-tank.mp4.
// Usage: node creatine-clip/render.js   (needs playwright, ffmpeg, python3 + numpy)
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const TL = require('./timeline.js');

const ROOT = path.resolve(__dirname, '..');
const BUILD = path.join(__dirname, 'build');
const OUT = path.join(ROOT, 'Exports', 'creatine-01-energy-tank.mp4');

(async () => {
  fs.mkdirSync(BUILD, { recursive: true });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const tlJson = path.join(BUILD, 'timeline.json');
  const wav = path.join(BUILD, 'sfx.wav');
  fs.writeFileSync(tlJson, JSON.stringify(TL, null, 1));
  execFileSync('python3', [path.join(__dirname, 'sfx.py'), tlJson, wav], { stdio: 'inherit' });

  const frames = Math.round(TL.DURATION * TL.FPS);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => window.ready);

  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(TL.FPS), '-c:v', 'png', '-i', '-',
    '-i', wav,
    '-frames:v', String(frames), '-t', String(TL.DURATION),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', OUT,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.setTime(t), f / TL.FPS);
    const png = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', (c) => (c ? rej(new Error('ffmpeg exit ' + c)) : res())));
  await browser.close();
  console.log(`wrote ${OUT} (${frames} frames, ${TL.DURATION}s)`);
})();
