#!/usr/bin/env python3
"""Synthesises the two audio stems from scratch (numpy only, no samples needed):

  audio/sfx.wav    every sound effect, placed from build/cues.json
                   (cues are registered by the animation code, so SFX always stay in sync)
  audio/music.wav  soft electronic bed whose energy follows the scene list in build/meta.json

Run `node scripts/render.mjs` (or `--still 0`) first so build/cues.json + meta.json exist.
"""
import json, os, wave
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SR = 48000
meta = json.load(open(os.path.join(ROOT, 'build/meta.json')))
cues = json.load(open(os.path.join(ROOT, 'build/cues.json')))
DUR = meta['video']['duration']
N = int(SR * DUR)
rs = np.random.RandomState(42)


def tt(d): return np.arange(int(SR * d)) / SR
def env(d, a=0.005, curve=5.0):
    t = tt(d); return np.minimum(1, t / a) * np.exp(-curve * t / d)
def sweep(f0, f1, d, shape=1.0):
    t = tt(d); f = f0 + (f1 - f0) * (t / d) ** shape
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def noise(d, lo, hi):
    n = int(SR * d); spec = np.fft.rfft(rs.randn(n)); f = np.fft.rfftfreq(n, 1 / SR)
    spec *= np.exp(-0.5 * ((np.log(np.maximum(f, 1)) - np.log(np.sqrt(lo * hi))) / (np.log(hi / lo) / 2.5)) ** 2)
    x = np.fft.irfft(spec, n); return x / (np.abs(x).max() + 1e-9)
def bell(d, peak=0.5): t = tt(d) / d; return np.sin(np.pi * t ** (np.log(0.5) / np.log(peak))) ** 2


def sfx_pop():      return sweep(950, 260, 0.09, 0.6) * env(0.09, 0.002, 4) * 0.8
def sfx_tick():     return (sweep(2400, 1800, 0.03) * env(0.03, 0.001, 5)) * 0.35
def sfx_blip():     return (sweep(700, 1300, 0.08) * env(0.08, 0.004, 3)) * 0.4
def sfx_chime():
    d = 0.9; t = tt(d)
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) * a for f, k, a in [(1318.5, 5, .5), (1975.5, 7, .3), (2637, 9, .2)]) * np.minimum(1, t / .004) * 0.35
def sfx_impact():
    d = 0.5
    body = sweep(150, 38, d, 0.35) * env(d, 0.002, 6)
    return body * 1.0 + np.pad(noise(0.12, 300, 5000) * env(0.12, 0.001, 6) * 0.5, (0, int(SR * d) - int(SR * 0.12)))
def sfx_whoosh():   return noise(0.55, 350, 6000) * bell(0.55, 0.55) * 0.75 + sweep(180, 620, 0.55, 2) * bell(0.55, 0.6) * 0.12
def sfx_swish():    return noise(0.28, 1200, 9000) * bell(0.28, 0.4) * 0.4
def sfx_sparkle():
    out = np.zeros(int(SR * 0.9))
    for i, f in enumerate([2093, 2637, 3136, 4186, 3520, 5274]):
        s = np.sin(2 * np.pi * f * tt(0.35)) * env(0.35, 0.002, 6) * 0.22
        a = int(SR * i * 0.085); out[a:a + len(s)] += s
    return out
def sfx_zap():
    d = 0.22; t = tt(d)
    return np.sign(np.sin(2 * np.pi * np.cumsum(1400 * np.exp(-t * 9) + 180) / SR)) * env(d, 0.002, 5) * 0.22 + noise(d, 2000, 9000) * env(d, 0.002, 7) * 0.2
def sfx_riser():    return (sweep(220, 1500, 0.55, 2.2) * 0.3 + noise(0.55, 1500, 8000) * 0.25) * (tt(0.55) / 0.55) ** 2
def sfx_fall():     return sweep(900, 110, 0.8, 0.6) * bell(0.8, 0.15) * 0.3
def sfx_pad():
    d = 2.2; t = tt(d)
    return sum(np.sin(2 * np.pi * f * t) for f in (261.6, 329.6, 392, 523.3)) * bell(d, 0.3) * 0.07
def sfx_fill():     return sweep(180, 520, 2.3, 1.2) * bell(2.3, 0.7) * 0.16 * (1 + 0.3 * np.sin(2 * np.pi * 9 * tt(2.3)))

SFX = {k[4:]: v for k, v in globals().items() if k.startswith('sfx_')}


def place(buf, mono, at, vol=1.0, pan=0.0):
    a = int(at * SR)
    if a >= N: return
    mono = mono[:N - a]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[a:a + len(mono), 0] += mono * vol * l * 1.2
    buf[a:a + len(mono), 1] += mono * vol * r * 1.2


def build_sfx():
    buf = np.zeros((N, 2))
    for i, c in enumerate(cues):
        if c['type'] not in SFX:
            print('unknown sfx type:', c['type']); continue
        pan = 0.0 if c['type'] in ('impact', 'whoosh', 'pad', 'riser', 'fall', 'fill') else ((i * 37) % 9 - 4) / 9
        place(buf, SFX[c['type']](), c['t'], c.get('vol', 1), pan)
    return np.tanh(buf * 1.1) * 0.85


# ── music: 100 BPM, Am7 – Fmaj7 – Cmaj7 – G6, energy per scene ─────────
BPM = 100; BEAT = 60 / BPM
CHORDS = [(110.0, [220.0, 261.63, 329.63, 392.0]), (87.31, [174.61, 220.0, 261.63, 329.63]),
          (130.81, [196.0, 261.63, 329.63, 493.88]), (98.0, [196.0, 246.94, 293.66, 329.63])]
#            kick pad  arp  hats bass
ENERGY = {'hook': (1, .9, .7, .6, 1), 'sources': (1, 1, 1, .7, 1), 'body': (0, 1, .9, .25, .6), 'energy': (1, 1, 1, 1, 1),
          'fast': (1, .7, 1, 1.4, 1), 'slow': (0, 1.1, .7, 0, .5), 'outro': (1, 1, 1, .8, 1)}

def level(idx):
    """per-sample gain curve for layer idx, with 0.4 s crossfades at scene changes"""
    g = np.zeros(N)
    for s in meta['scenes']:
        a, b = int(s['start'] * SR), min(N, int((s['start'] + s['dur']) * SR))
        g[a:b] = ENERGY.get(s['id'], (1, 1, 1, 1, 1))[idx]
    k = int(0.4 * SR); return np.convolve(np.pad(g, k // 2, mode='edge'), np.ones(k) / k, mode='valid')[:N]

def build_music():
    L = np.zeros(N); R = np.zeros(N)
    kick, pad, arp, hats, bass = (np.zeros(N) for _ in range(5))
    kick_s = sweep(120, 42, 0.28, 0.4) * env(0.28, 0.003, 5)
    hat_s = noise(0.05, 6000, 14000) * env(0.05, 0.001, 6)
    def add(buf, s, at):
        a = int(at * SR)
        if a < N: s = s[:N - a]; buf[a:a + len(s)] += s
    beats = int(DUR / BEAT) + 1
    for b in range(beats):
        t0 = b * BEAT
        root, notes = CHORDS[(b // 4) % 4]
        add(kick, kick_s, t0)
        add(hats, hat_s * 0.6, t0 + BEAT / 2)
        add(hats, hat_s * 0.25, t0 + BEAT / 4); add(hats, hat_s * 0.25, t0 + 3 * BEAT / 4)
        tb = tt(BEAT * 0.9)
        add(bass, (np.sin(2 * np.pi * root * tb) + 0.3 * np.sin(4 * np.pi * root * tb)) * env(BEAT * 0.9, 0.01, 2.5) * (1 if b % 4 == 0 else 0.6), t0)
        for j in range(2):                                   # 8th-note pluck arpeggio
            f = notes[(b * 2 + j) % 4] * 2
            tp = tt(0.4)
            pl = (np.sin(2 * np.pi * f * tp) + 0.35 * np.sin(4 * np.pi * f * tp)) * env(0.4, 0.004, 6)
            add(arp, pl, t0 + j * BEAT / 2)
        if b % 4 == 0:                                       # one soft pad per bar
            d = BEAT * 4 + 0.6; tp = tt(d)
            e = np.minimum(1, tp / 0.5) * np.minimum(1, (d - tp) / 0.6)
            ch = sum(np.sin(2 * np.pi * f * (1 + dt) * tp + ph) for f in notes for dt, ph in ((0, 0), (0.004, 1), (-0.004, 2)))
            add(pad, ch * e / 12, t0)
    mono = kick * 0.5 * level(0) + bass * 0.22 * level(4)
    side = pad * 0.5 * level(1)
    a = arp * 0.11 * level(2); h = hats * 0.1 * level(3)
    d = int(0.3 * SR)                                         # ping-pong echo on the arpeggio
    L += mono + side + a + h * 0.8; R += mono + side * 0.95 + h
    R[d:] += a[:-d] * 0.6; L[2 * d:] += a[:-2 * d] * 0.3; R += a * 0.5
    out = np.stack([L, R], 1)
    fade = np.minimum(1, np.arange(N) / (0.5 * SR)) * np.minimum(1, (N - np.arange(N)) / (1.5 * SR))
    out *= fade[:, None]
    return out / np.abs(out).max() * 0.7


def save(name, buf):
    path = os.path.join(ROOT, 'audio', name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(buf, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'{name}: {len(buf) / SR:.2f}s  peak {np.abs(buf).max():.2f}')


if __name__ == '__main__':
    save('sfx.wav', build_sfx())
    save('music.wav', build_music())
    print(f'{len(cues)} sfx cues placed')
