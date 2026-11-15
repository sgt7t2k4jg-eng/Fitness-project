// Writes Exports/captions.srt and Exports/storyboard.md from the same timeline the video uses.
const fs = require('fs');
const path = require('path');
require('../src/timeline.js');
require('../src/scenes.js');

const { scenes, captions, duration } = globalThis.Timeline.build(globalThis.SCENES);
const out = path.join(__dirname, '../Exports');
fs.mkdirSync(out, { recursive: true });

const pad = (n, l = 2) => String(n).padStart(l, '0');
const srtTime = (t) => {
  const ms = Math.round(t * 1000);
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};
const clock = (t) => `${Math.floor(t / 60)}:${pad((t % 60).toFixed(1), 4)}`;

const srt = captions.map((c, i) => {
  const end = i < captions.length - 1 ? Math.min(captions[i + 1].start, scenes[c.scene].end) : scenes[c.scene].end;
  return `${i + 1}\n${srtTime(c.start)} --> ${srtTime(end)}\n${c.text}\n`;
}).join('\n');
fs.writeFileSync(path.join(out, 'captions.srt'), srt);

const accentName = { lime: 'Lime', coral: 'Coral', mint: 'Mint' };
let md = `# Storyboard — الكربوهيدرات\n\n`;
md += `Format: 1080×1920 (9:16), 30 fps · Length: ${clock(duration)} · ${scenes.length} scenes · ${captions.length} captions\n\n`;
md += `Timings are paced for a brisk read and follow the words: every graphic is cued to the word it illustrates.\n\n`;
md += `| # | Time | Theme | Visual / motion | Captions (voiceover, word for word) |\n|---|---|---|---|---|\n`;
scenes.forEach((s, i) => {
  const caps = s.caps.map((c) => `\`${clock(c.start)}\` ${c.text}`).join('<br>');
  md += `| ${i + 1} | ${clock(s.start)} – ${clock(s.end)} | ${accentName[s.accent]} | ${s.visual} | ${caps} |\n`;
});
fs.writeFileSync(path.join(out, 'storyboard.md'), md);
console.log(`Wrote captions.srt and storyboard.md (${clock(duration)}, ${captions.length} captions).`);
