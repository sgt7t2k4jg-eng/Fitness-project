// Renders the video frame by frame with headless Chromium, then encodes with ffmpeg.
//   node tools/render.js                      -> Exports/carbs.mp4 (sound effects only, no music)
//   node tools/render.js --audio voice.mp3    -> mixes the voiceover over the sound effects
//   node tools/render.js --shots 3,12.5,40    -> PNG stills only (for review)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const { writeSfxWav } = require('./sfx.js');
const path = require('path');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : null; };
const FPS = 30, WORKERS = 4;
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'Exports');
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
  const cues = await first.evaluate(() => window.VIDEO.sfx);
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
  // Coverage check: every animated element, caption and scene change must have a cue.
  const stats = await first.evaluate(() => {
    const V = window.VIDEO, n = (t) => V.sfx.filter((c) => c.type === t).length;
    const els = V.scenes.reduce((a, s) => a + s.items.filter((i) => !i.node.classList.contains('a-dim')).length, 0);
    return { els, elCues: V.sfx.length - n('whoosh') - n('caption'), caps: V.captions.length, capCues: n('caption'), scenes: V.scenes.length, whoosh: n('whoosh') };
  });
  console.log('SFX coverage:', JSON.stringify(stats));
  if (stats.els !== stats.elCues || stats.caps !== stats.capCues || stats.whoosh !== stats.scenes - 1) throw new Error('SFX coverage incomplete');
  await browser.close();

  const audio = opt('audio');
  const sfxWav = path.join(frames, 'sfx.wav');
  writeSfxWav(sfxWav, cues, duration);
  const out = path.join(outDir, 'carbs.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.jpg'),
    '-i', sfxWav,
    ...(audio ? ['-i', audio, '-filter_complex', '[1:a][2:a]amix=inputs=2:duration=first:normalize=0[a]', '-map', '0:v', '-map', '[a]'] : []),
    '-c:a', 'aac', '-b:a', '192k',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(frames, { recursive: true, force: true });
  console.log(`Wrote ${out} (${duration.toFixed(1)}s, ${total} frames)`);
})();
