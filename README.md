# الكربوهيدرات — explainer video

Vertical (1080×1920, 30 fps) motion-graphics video about carbohydrates in Moroccan Darija,
built as an HTML animation and rendered to MP4.

| File | What it is |
|---|---|
| `Exports/carbs.mp4` | The rendered video: sound effects only, no music (add the voiceover on top) |
| `Exports/captions.srt` | The captions as a subtitle file |
| `Exports/storyboard.md` | Scene-by-scene timings, visuals and captions |
| `script/voiceover.txt` | The voiceover script, exactly as written |
| `src/scenes.js` | The scenes: caption breaks and motion graphics |
| `src/index.html` | Live preview — open in a browser, space to play, drag to scrub |

## The script is never altered

`npm run verify` compares every caption word against `script/voiceover.txt` and fails on any
difference. The only on-screen change is that the stray `«` `»` quote marks are hidden.
Graphic labels use only words that appear in the script.

## Re-rendering

```
npm install          # Playwright (headless Chromium); ffmpeg must be installed
npm run render       # verify + storyboard/SRT + Exports/carbs.mp4
node tools/render.js --audio voiceover.mp3    # same, with the voiceover mixed over the sound effects
```

## Timing

There is no recorded voiceover yet, so word timings are estimated from word length at a brisk
reading pace (`SPEED` in `src/timeline.js`). Every graphic is cued to the word it illustrates,
so re-timing moves captions and graphics together. To sync to a real recording, set
`window.CAPTION_STARTS` (one start time in seconds per caption, in order) before `video.js` loads.

Font: Cairo (SIL Open Font License, see `src/fonts/LICENSE-Cairo.txt`).
