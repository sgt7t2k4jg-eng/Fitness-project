// Synthesises the sound-effect track (no music, no samples).
// One sound per cue: whoosh (scene change), pop / chime (graphics popping in, key moments),
// swish (cards sliding in), draw (lines and arrows), fill (bars and tanks), count (number
// counters), tick (outlines, fades) and caption (each new caption line).
const fs = require('fs');
const SR = 48000;

const make = (seconds, fn) => {
  const n = Math.floor(SR * seconds), out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = fn(i / n, i / SR, i) * Math.min(1, i / 60) * Math.min(1, (n - i) / 120);
  return out;
};
function noiseBand(seconds, freqAt, gain) {       // swept band-passed noise
  let low = 0, band = 0, seed = 12345;
  return make(seconds, (p) => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const f = 2 * Math.sin(Math.PI * freqAt(p) / SR);
    low += f * band; band += f * (seed / 2147483648 - 1 - low - 0.6 * band);
    return band * Math.pow(Math.sin(Math.PI * p), 2) * gain;
  });
}
function glide(seconds, f0, f1, gain, decay) {    // sine with a pitch slide
  let ph = 0;
  return make(seconds, (p) => {
    ph += 2 * Math.PI * (f0 * Math.pow(f1 / f0, p)) / SR;
    return Math.sin(ph) * Math.exp(-p * decay) * gain;
  });
}
const bell = (seconds, f, gain, decay) =>
  make(seconds, (p, t) => (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * decay) + 0.5 * Math.sin(2 * Math.PI * f * 1.5 * t) * Math.exp(-t * decay * 1.4)) * gain);

const SOUNDS = {
  whoosh: () => noiseBand(0.42, (p) => 500 + 2600 * Math.sin(Math.PI * p), 0.1),
  swish: () => noiseBand(0.2, (p) => 1200 + 2400 * p, 0.05),
  pop: () => glide(0.09, 560, 235, 0.13, 6),
  chime: () => bell(0.7, 1318.5, 0.085, 7),
  tick: () => bell(0.12, 2093, 0.03, 45),
  caption: () => glide(0.035, 1500, 1100, 0.035, 5),
  draw: (dur) => glide(Math.min(0.45, Math.max(0.2, dur)), 420, 950, 0.04, 1.5),
  fill: (dur) => glide(Math.min(1.4, Math.max(0.4, dur)) * 0.7, 260, 620, 0.04, 1.2),
  count: (dur) => {                               // a run of ticks that follows the counter's ease-out
    const tick = glide(0.03, 1900, 1500, 0.035, 4), n = Math.floor(SR * dur), out = new Float32Array(n + tick.length);
    for (let k = 0; k < 12; k++) {
      const at = Math.floor((1 - Math.cbrt(1 - k / 12)) * n);
      for (let i = 0; i < tick.length; i++) out[at + i] += tick[i];
    }
    return out;
  },
};

function writeSfxWav(file, cues, duration) {
  const mix = new Float32Array(Math.ceil(duration * SR));
  const seen = new Set();
  cues.forEach((c) => {
    const id = c.type + '@' + c.t.toFixed(3);       // identical simultaneous cues play once
    if (seen.has(id)) return;
    seen.add(id);
    const s = SOUNDS[c.type](c.dur || 0.5), at = Math.floor(c.t * SR);
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
