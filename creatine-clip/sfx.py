"""Synthesises the SFX-only soundtrack (no music) from timeline.json -> sfx.wav."""
import json
import sys
import wave

import numpy as np

SR = 48000
tl = json.load(open(sys.argv[1]))
out_path = sys.argv[2]
C = tl["cues"]
N = int(SR * tl["DURATION"])
mix = np.zeros(N + SR)
rng = np.random.default_rng(7)


def add(sig, at, gain=1.0):
    i = int(at * SR)
    mix[i:i + len(sig)] += sig * gain


def tt(dur):
    return np.arange(int(dur * SR)) / SR


def sweep(f0, f1, dur, curve=1.0):
    t = tt(dur)
    f = f0 + (f1 - f0) * (t / dur) ** curve
    return np.sin(2 * np.pi * np.cumsum(f) / SR), t


def lowpass(x, cutoff):
    """One-pole low-pass with a per-sample cutoff array."""
    a = 1 - np.exp(-2 * np.pi * np.asarray(cutoff) / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def tick(pitch=1.0):
    t = tt(0.03)
    return np.sin(2 * np.pi * 1700 * pitch * t) * np.exp(-t * 190)


def pop(pitch=1.0):
    s, t = sweep(820 * pitch, 240 * pitch, 0.11, 0.5)
    return s * np.exp(-t * 34) * np.minimum(1, t * 900)


def whoosh(dur=0.36):
    t = tt(dur)
    n = rng.standard_normal(len(t))
    cut = 400 + 5200 * np.sin(np.pi * t / dur) ** 2
    return lowpass(n, cut) * np.sin(np.pi * t / dur) ** 2 * 1.6


def ding(base=1318.5):
    t = tt(0.75)
    s = sum(a * np.sin(2 * np.pi * base * m * t) for m, a in ((1, 1), (1.5, .5), (2, .35), (3.01, .15)))
    return s * np.exp(-t * 6.5) * np.minimum(1, t * 600)


def thud():
    s, t = sweep(130, 48, 0.3, 0.6)
    buzz = np.sign(np.sin(2 * np.pi * 92 * t)) * np.exp(-t * 16) * .22
    return s * np.exp(-t * 13) + lowpass(buzz, np.full(len(t), 900.0))


def bonk():
    t = tt(0.3)
    a = np.sin(2 * np.pi * 330 * t) * (t < .11)
    b = np.sin(2 * np.pi * 220 * t) * (t >= .12)
    env = np.where(t < .12, np.exp(-t * 22), np.exp(-(t - .12) * 14))
    return (a + b) * env


def drain(dur):
    s, t = sweep(950, 150, dur, 0.8)
    wob = 1 + .25 * np.sin(2 * np.pi * 17 * t)
    return s * wob * np.sin(np.pi * np.minimum(1, t / dur * 1.02)) ** .5


def fill(dur):
    s, t = sweep(220, 1150, dur, 1.4)
    rate = 9 + 22 * t / dur
    bubbles = .55 + .45 * np.sin(2 * np.pi * np.cumsum(rate) / SR)
    return s * bubbles * np.sin(np.pi * t / dur) ** .6


def rep(i):
    t = tt(0.07)
    f = 620 * 2 ** (i / 12)
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 70)


# Caption transitions: a soft tick on every word, a touch brighter on each new caption line.
first_words = {g["words"][0] for g in tl["groups"]}
for i, w in enumerate(tl["words"]):
    add(tick(1.25 if i in first_words else 1.0), w["start"], .16 if i in first_words else .1)

add(pop(1.0), C["dumbbell"], .7)
add(pop(1.2), C["muscle"], .7)
add(pop(1.45), C["bolt"], .7)
add(drain(C["drainEnd"] - C["drainStart"]), C["drainStart"], .2)
add(thud(), C["empty"], .85)
add(whoosh(), C["scene2"] - .1, .5)
add(pop(1.1), C["scene2"], .75)
add(fill(C["fillEnd"] - C["fillStart"]), C["fillStart"], .22)
add(ding(), C["full"], .42)
add(whoosh(), C["scene3"] - .08, .5)
for i, r in enumerate(C["reps"]):
    add(rep(i), r, .42)
add(bonk(), C["stop"], .6)
add(whoosh(0.24), C["stopOut"] - .04, .4)
add(pop(1.3), C["plus1"], .8)
add(ding(1568.0), C["plus1"], .25)
add(pop(1.6), C["plus2"], .8)
add(ding(2093.0), C["plus2"], .4)

mix = mix[:N]
fade = int(.05 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)
mix *= 10 ** (-1.5 / 20) / np.max(np.abs(mix))
pcm = (mix * 32767).astype("<i2")
with wave.open(out_path, "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(np.repeat(pcm, 2).tobytes())
print(f"wrote {out_path} ({N / SR:.2f}s)")
