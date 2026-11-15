# Fitness Reels – code-driven motion graphics

Vertical Instagram Reels (1080×1920, 30 fps, H.264) built entirely from code:
original SVG stickers, GSAP animation, synthesised music and sound effects.
No stock footage, no external assets.

**First video:** `output/carbs-reel.mp4` – "شنو هي الكربوهيدرات؟" (60 s, Moroccan Darija).

## How it works

```
src/content.js      ← EDIT HERE: scene order, timings, voiceover lines, all on-screen Darija text
src/config.js       ← brand colours, resolution, fps, duration
src/stickers.js     ← sticker library (bread, rice, potato, lentils, sugar, fruit, sweets, juice, organs…)
src/engine.js       ← animation presets (pop, fly, slam, words, burst, shake…) + scene transitions
src/scenes/*.js     ← one file per scene
scripts/render.mjs  ← headless Chromium renders every frame → ffmpeg encodes H.264
scripts/audio.py    ← synthesises audio/music.wav and audio/sfx.wav
scripts/mux.mjs     ← mixes stems (+ voiceover if present) and writes output/<name>.mp4
```

Every animation preset registers its own sound cue (`ctx.pop` → pop, `ctx.slam` → impact,
transitions → whoosh), so sound effects stay frame-synced when timings change.

## Commands

```bash
npm install
npm run preview     # live preview at http://localhost:4173 (space = pause, ←/→ = ±1 s)
npm run build       # render frames → stems → final MP4 (several minutes on 4 cores)

node scripts/render.mjs --still 2.4,17,31   # quick PNG stills in build/stills/
```

Requires Node 18+, Python 3 with numpy, ffmpeg, and Playwright's Chromium.

## Voiceover

The video is timed to the voiceover lines in `src/content.js`
(timecoded copies: `output/voiceover-script.txt` / `.srt`).

1. Record the lines against the timecodes (or against the muted video).
2. Save the take as `audio/voiceover.wav` (60 s, starting at 0:00).
3. `npm run mux` – the voiceover is mixed in and the music ducks under it automatically.

`scripts/voiceover.py` can generate a draft with a Moroccan neural TTS voice where
the `edge-tts` service is reachable.

## Audio stems

| File | Content |
|---|---|
| `audio/music.wav` | background music only |
| `audio/sfx.wav` | sound effects only |
| `audio/voiceover.wav` | your voiceover (not included – add it) |
| `output/mix.wav` | final mix used in the MP4 |

Mix levels are constants at the top of `scripts/mux.mjs`.

## Making the next Reel

1. Edit `src/content.js`: new voiceover lines, on-screen text, scene durations.
2. Reuse scenes or add a file in `src/scenes/` and list it in `SCENES`.
3. Need a new illustration? Add an SVG entry to `src/stickers.js` (200×200 box) –
   the die-cut border and shadow are added automatically.
4. `npm run build` (pass a name to the last step: `node scripts/mux.mjs protein-reel`).

Layout note: key text is kept between y≈220 and y≈1620 so Instagram's UI does not cover it.
