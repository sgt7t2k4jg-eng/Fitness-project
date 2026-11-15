/* Builds the timing of every word, caption and scene from the scene texts.
   Shared by the browser player and the Node tools. */
(function (g) {
  // Pacing knobs. Timings are estimates until a real voiceover is recorded:
  // raise SPEED for a faster read, or set CAPTION_STARTS (see README) to sync to audio.
  const SPEED = 1.0;
  const LEAD = 0.25;   // silence before the first word of a scene
  const TAIL = 0.35;   // silence after the last word of a scene
  const BASE = 0.13;   // seconds per word
  const PER_LETTER = 0.045;

  const clean = (w) => w.replace(/[«».،:]/g, '');      // key used to match cues
  const display = (w) => w.replace(/[«»]/g, '');        // caption text (quote marks hidden)

  function build(scenes, captionStarts) {
    let t = 0;
    const captions = [];
    scenes.forEach((s, si) => {
      s.index = si;
      s.start = t;
      t += LEAD;
      s.words = [];
      s.caps = [];
      s.text.split('|').forEach((chunk) => {
        const cap = { scene: si, words: [], start: t };
        chunk.trim().split(/\s+/).forEach((raw) => {
          let letters = clean(raw).replace(/[ً-ْ]/g, '').length;
          if (/\d/.test(raw)) letters = 6;        // numbers are spoken as full words
          if (/^[+=]$/.test(raw)) letters = 4;
          const d = (BASE + PER_LETTER * letters) / SPEED;
          const w = { raw, text: display(raw), key: clean(raw), start: t, end: t + d };
          t += d;
          if (/\./.test(raw)) t += 0.3 / SPEED;
          else if (/[،:]/.test(raw)) t += 0.15 / SPEED;
          cap.words.push(w);
          s.words.push(w);
        });
        cap.end = t;
        cap.text = cap.words.map((w) => w.text).join(' ');
        s.caps.push(cap);
        captions.push(cap);
      });
      t += (s.hold || 0) + TAIL;
      s.end = t;
    });
    let duration = t;

    // Optional sync to a recorded voiceover: one start time (seconds) per caption.
    if (captionStarts && captionStarts.length === captions.length) {
      const xs = [0, ...captions.map((c) => c.start), duration];
      const last = captionStarts[captionStarts.length - 1];
      const ys = [0, ...captionStarts, last + (duration - captions[captions.length - 1].start)];
      const warp = (x) => {
        let i = 1;
        while (i < xs.length - 1 && x > xs[i]) i++;
        const span = xs[i] - xs[i - 1] || 1;
        return ys[i - 1] + ((x - xs[i - 1]) / span) * (ys[i] - ys[i - 1]);
      };
      scenes.forEach((s) => {
        s.start = warp(s.start);
        s.end = warp(s.end);
        s.words.forEach((w) => { w.start = warp(w.start); w.end = warp(w.end); });
        s.caps.forEach((c) => { c.start = warp(c.start); c.end = warp(c.end); });
      });
      duration = ys[ys.length - 1];
    }
    return { scenes, captions, duration };
  }

  g.Timeline = { build, clean, display };
})(typeof window !== 'undefined' ? window : globalThis);
