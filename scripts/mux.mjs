#!/usr/bin/env node
// Mixes the stems and muxes them with the rendered picture.
//   build/video.mp4 + audio/music.wav + audio/sfx.wav (+ audio/voiceover.wav if present)
//   → output/<name>.mp4, output/mix.wav, output/voiceover-script.{txt,srt}
// When a voiceover is present the music ducks under it automatically.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...a) => path.join(ROOT, ...a);
const NAME = process.argv[2] || 'carbs-reel';
const MUSIC_DB = -10, SFX_DB = -1, VO_DB = 0;      // mix levels
const meta = JSON.parse(fs.readFileSync(p('build/meta.json')));
fs.mkdirSync(p('output'), { recursive: true });

const run = (args) => { const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' }); if (r.status !== 0) process.exit(1); };
const hasVO = fs.existsSync(p('audio/voiceover.wav'));
const inputs = ['-i', p('audio/music.wav'), '-i', p('audio/sfx.wav'), ...(hasVO ? ['-i', p('audio/voiceover.wav')] : [])];
const graph = hasVO
  ? `[2:a]volume=${VO_DB}dB,asplit=2[vo][key];[0:a]volume=${MUSIC_DB}dB[m];[m][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[md];` +
    `[1:a]volume=${SFX_DB - 3}dB[s];[md][s][vo]amix=inputs=3:normalize=0,alimiter=limit=0.89[out]`
  : `[0:a]volume=${MUSIC_DB}dB[m];[1:a]volume=${SFX_DB}dB[s];[m][s]amix=inputs=2:normalize=0,alimiter=limit=0.89[out]`;
run([...inputs, '-filter_complex', graph, '-map', '[out]', '-t', String(meta.video.duration), '-ar', '48000', p('output/mix.wav')]);
run(['-i', p('build/video.mp4'), '-i', p('output/mix.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-t', String(meta.video.duration), p(`output/${NAME}.mp4`)]);

// voiceover script with timecodes, for recording or TTS
const tc = (s) => { const ms = Math.round(s * 1000); const z = (n, l = 2) => String(n).padStart(l, '0');
  return `${z(Math.floor(ms / 3600000))}:${z(Math.floor(ms / 60000) % 60)}:${z(Math.floor(ms / 1000) % 60)},${z(ms % 1000, 3)}`; };
fs.writeFileSync(p('output/voiceover-script.srt'), meta.scenes.map((s, i) =>
  `${i + 1}\n${tc(s.start + 0.3)} --> ${tc(s.start + s.dur - 0.3)}\n${s.vo}\n`).join('\n'));
fs.writeFileSync(p('output/voiceover-script.txt'), meta.scenes.map((s) =>
  `[${s.start.toFixed(1)}s – ${(s.start + s.dur).toFixed(1)}s]  ${s.id}\n${s.vo}\n`).join('\n'));
console.log(`output/${NAME}.mp4 written (${hasVO ? 'music + sfx + voiceover' : 'music + sfx, no voiceover file found'})`);
