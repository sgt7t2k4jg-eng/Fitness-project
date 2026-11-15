#!/usr/bin/env node
// Frame-accurate renderer: headless Chromium seeks the composition frame by frame,
// screenshots are encoded to H.264 by ffmpeg.
//
//   node scripts/render.mjs                 full render  → build/video.mp4 (+ build/cues.json, build/meta.json)
//   node scripts/render.mjs --still 1.5,12  PNG stills   → build/stills/
//   node scripts/render.mjs --serve         live preview → http://localhost:4173
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(ROOT, 'build');
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i < 0 ? null : (args[i + 1] ?? true); };

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.wav': 'audio/wav', '.png': 'image/png', '.json': 'application/json', '.mp4': 'video/mp4' };

function serve(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = path.join(ROOT, rel === '/' ? 'index.html' : rel);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

if (flag('--serve')) {
  await serve(4173);
  console.log('Preview: http://localhost:4173  (space = pause, ←/→ = ±1s, ?t=12 starts at 12s)');
} else {
  const require = createRequire(import.meta.url);
  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch { ({ chromium } = createRequire('/opt/node-tools/node_modules/')('playwright')); }

  const server = await serve(0);
  const url = `http://127.0.0.1:${server.address().port}/index.html?render=1`;
  const browsers = [];
  const open = async () => {
    // one browser process per worker: screenshots inside a single browser do not run in parallel
    const browser = await chromium.launch();
    browsers.push(browser);
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => { console.error('PAGE ERROR:', e.message); process.exitCode = 1; });
    page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
    await page.goto(url);
    await page.waitForFunction('window.__ready === true', null, { timeout: 30000 });
    return page;
  };
  fs.mkdirSync(BUILD, { recursive: true });

  const first = await open();
  const meta = await first.evaluate('window.__meta');
  const cues = await first.evaluate('window.__cues');
  fs.writeFileSync(path.join(BUILD, 'meta.json'), JSON.stringify(meta, null, 2));
  fs.writeFileSync(path.join(BUILD, 'cues.json'), JSON.stringify(cues, null, 2));
  const { fps, duration } = meta.video;

  if (flag('--still')) {
    const dir = path.join(BUILD, 'stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of String(flag('--still')).split(',').map(Number)) {
      await first.evaluate((s) => window.__seek(s), t);
      await first.screenshot({ path: path.join(dir, `t${t.toFixed(2).padStart(5, '0')}.png`) });
    }
    console.log('stills →', dir);
  } else {
    const frames = path.join(BUILD, 'frames');
    fs.rmSync(frames, { recursive: true, force: true });
    fs.mkdirSync(frames, { recursive: true });
    const total = Math.round(fps * duration);
    const workers = Math.max(1, Math.min(Number(flag('--workers')) || os.cpus().length, 8));
    const pages = [first, ...(await Promise.all(Array.from({ length: workers - 1 }, open)))];
    let done = 0;
    const t0 = Date.now();
    await Promise.all(pages.map(async (page, w) => {
      // each worker renders one contiguous slice, always moving forward in time
      const from = Math.floor((total * w) / workers), to = Math.floor((total * (w + 1)) / workers);
      for (let f = from; f < to; f++) {
        await page.evaluate((s) => window.__seek(s), f / fps);
        await page.screenshot({ path: path.join(frames, String(f).padStart(5, '0') + '.png') });
        if (++done % 150 === 0) console.log(`frames ${done}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
      }
    }));
    console.log(`rendered ${total} frames with ${workers} workers`);
    const out = path.join(BUILD, 'video.mp4');
    const ff = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(frames, '%05d.png'),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-profile:v', 'high', '-level', '4.2', '-pix_fmt', 'yuv420p',
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', String(fps), '-an', out], { stdio: 'inherit' });
    if (ff.status !== 0) process.exit(1);
    console.log('video →', out);
  }
  await Promise.all(browsers.map((b) => b.close()));
  server.close();
}
