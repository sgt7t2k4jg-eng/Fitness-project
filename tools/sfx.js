// Synthesises the sound-effect track (no music, no samples): whoosh, pop and chime.
const fs = require('fs');
const SR = 48000;

function whoosh() {
  const n = Math.floor(SR * 0.42), out = new Float32Array(n);
  let low = 0, band = 0, seed = 12345;
  for (let i = 0; i < n; i++) {
    const p = i / n;
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const noise = seed / 2147483648 - 1;
    const f = 2 * Math.sin(Math.PI * (500 + 2600 * Math.sin(Math.PI * p)) / SR);   // swept band-pass
    low += f * band; band += f * (noise - low - 0.6 * band);
    out[i] = band * Math.pow(Math.sin(Math.PI * p), 2) * 0.1;
  }
  return out;
}
function pop() {
  const n = Math.floor(SR * 0.09), out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const p = i / n;
    ph += 2 * Math.PI * (560 * Math.pow(0.42, p)) / SR;
    out[i] = Math.sin(ph) * Math.exp(-p * 6) * Math.min(1, i / 60) * 0.13;
  }
  return out;
}
function chime() {
  const n = Math.floor(SR * 0.7), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = (Math.sin(2 * Math.PI * 1318.5 * t) * Math.exp(-t * 7) + 0.5 * Math.sin(2 * Math.PI * 1975.5 * t) * Math.exp(-t * 10))
      * Math.min(1, i / 90) * 0.085;
  }
  return out;
}

function writeSfxWav(file, cues, duration) {
  const sounds = { whoosh: whoosh(), pop: pop(), chime: chime() };
  const mix = new Float32Array(Math.ceil(duration * SR));
  let lastPop = -1;
  cues.slice().sort((a, b) => a.t - b.t).forEach((c) => {
    if (c.type === 'pop') { if (c.t - lastPop < 0.07) return; lastPop = c.t; }   // keep staggered bursts clean
    const s = sounds[c.type], at = Math.floor(c.t * SR);
    for (let i = 0; i < s.length && at + i < mix.length; i++) mix[at + i] += s[i];
  });
  const data = Buffer.alloc(mix.length * 2);
  for (let i = 0; i < mix.length; i++) data.writeInt16LE(Math.round(Math.tanh(mix[i]) * 32767), i * 2);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
}
module.exports = { writeSfxWav };
