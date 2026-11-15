/* Player: every frame is a pure function of time, so the same code drives the
   live preview and the frame-by-frame MP4 render (window.seek). */
(function () {
  const { scenes, captions, duration } = Timeline.build(window.SCENES, window.CAPTION_STARTS);
  const stage = document.getElementById('stage');
  const sceneLayer = document.getElementById('scenes');
  const capEl = document.getElementById('caption');

  const clamp = (x) => Math.max(0, Math.min(1, x));
  const outCubic = (p) => 1 - Math.pow(1 - p, 3);
  const outBack = (p) => { const c = 1.9, q = p - 1; return 1 + (c + 1) * q * q * q + c * q * q; };

  // "word", "word#2", "w3", "start", "end" + any number of "+0.3" / "-0.2" offsets
  function cueTime(scene, spec) {
    let base = spec, off = 0, m;
    while ((m = base.match(/^(.+?)([+-]\d*\.?\d+)$/))) { base = m[1]; off += parseFloat(m[2]); }
    if (base === 'start') return scene.start + off;
    if (base === 'end') return scene.end + off;
    if ((m = base.match(/^w(\d+)$/))) return scene.words[+m[1]].start + off;
    const [key, nth] = base.split('#');
    const hits = scene.words.filter((w) => w.key === key);
    const w = hits[(nth ? +nth : 1) - 1];
    if (!w) throw new Error(`Scene "${scene.id}": cue word "${spec}" not found`);
    return w.start + off;
  }

  // Build scene DOM and resolve cues
  scenes.forEach((s) => {
    const el = document.createElement('section');
    el.className = 'scene accent-' + s.accent;
    el.innerHTML = s.html;
    sceneLayer.appendChild(el);
    s.el = el;
    s.items = [...el.querySelectorAll('[data-at]')].map((node) => {
      const tIn = cueTime(s, node.dataset.at);
      const dur = node.dataset.until ? cueTime(s, node.dataset.until) - tIn : parseFloat(node.dataset.dur || 0.55);
      return { node, tIn, dur, linear: node.dataset.ease === 'linear',
               count: node.dataset.count ? +node.dataset.count : null, suffix: node.dataset.suffix || '', last: -1 };
    });
  });

  let shownCap = null;
  function renderCaption(t) {
    const cap = captions.find((c, i) => t >= c.start - 0.05 && (i === captions.length - 1 || t < captions[i + 1].start - 0.05));
    if (cap !== shownCap) {
      shownCap = cap;
      capEl.innerHTML = '';
      if (cap) cap.spans = cap.words.map((w) => {
        const sp = document.createElement('span');
        sp.textContent = w.text;
        capEl.appendChild(sp);
        return sp;
      });
    }
    if (!cap) return;
    const sc = scenes[cap.scene];
    const inP = outCubic(clamp((t - (cap.start - 0.05)) / 0.2));
    const outP = cap.scene === scenes.length - 1 ? 0 : clamp((t - (sc.end - 0.25)) / 0.25);
    capEl.style.opacity = inP * (1 - outP);
    capEl.style.transform = `translateY(${(1 - inP) * 24}px) scale(${0.96 + 0.04 * inP})`;
    cap.words.forEach((w, i) => {
      const sp = cap.spans[i];
      const next = cap.words[i + 1];
      const state = t < w.start ? 'next' : !next || t < next.start ? 'now' : 'done';
      if (sp.className !== state) sp.className = state;
    });
  }

  function seek(t) {
    t = Math.max(0, Math.min(duration, t));
    stage.style.setProperty('--t', t.toFixed(3));
    let accent = 'lime';
    scenes.forEach((s, si) => {
      const active = t >= s.start && (t < s.end || si === scenes.length - 1);
      if (!active) { if (s.on) { s.el.style.visibility = 'hidden'; s.on = false; } return; }
      accent = s.accent;
      if (!s.on) { s.el.style.visibility = 'visible'; s.on = true; }
      const isLast = si === scenes.length - 1;
      const inP = si === 0 ? 1 : outCubic(clamp((t - s.start) / 0.4));
      const outP = isLast ? 0 : clamp((t - (s.end - 0.25)) / 0.25);
      s.el.style.opacity = inP * (1 - outP);
      s.el.style.transform = `translateY(${(1 - inP) * 46 - outP * 30}px) scale(${1 - outP * 0.03})`;
      s.el.style.setProperty('--st', (t - s.start).toFixed(3));
      s.el.style.setProperty('--sp', clamp((t - s.start) / (s.end - s.start)).toFixed(4));
      s.items.forEach((it) => {
        const raw = clamp((t - it.tIn) / it.dur);
        if (raw === it.last) return;
        it.last = raw;
        const p = it.linear ? raw : outCubic(raw);
        it.node.style.setProperty('--p', p.toFixed(4));
        it.node.style.setProperty('--pb', outBack(raw).toFixed(4));
        if (it.count !== null) it.node.textContent = Math.round(p * it.count) + it.suffix;
      });
    });
    if (stage.dataset.accent !== accent) stage.dataset.accent = accent;
    renderCaption(t);
  }

  window.seek = seek;
// Sound-effect cue sheet (no music): whoosh on scene changes, soft pop when a graphic
  // pops in, chime on the key moments (badges, stamps, big numbers, result tiles).
  const sfx = [];
  scenes.forEach((s, si) => {
    if (si > 0) sfx.push({ t: s.start - 0.1, type: 'whoosh' });
    s.items.forEach((it) => {
      const c = it.node.classList;
      if (!c.contains('a-pop')) return;
      const key = ['stamp', 'badge-big', 'win', 'bignum', 'gauge'].some((k) => c.contains(k));
      sfx.push({ t: Math.max(0, it.tIn), type: key ? 'chime' : 'pop' });
    });
  });
  window.VIDEO = { duration, scenes, captions, sfx };

  // ---- live preview (skipped when rendering frames) ----
  const rendering = new URLSearchParams(location.search).has('render');
  if (rendering) { document.body.classList.add('render'); seek(0); return; }

  const scrub = document.getElementById('scrub');
  const playBtn = document.getElementById('play');
  const clock = document.getElementById('clock');
  const fmt = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
  let t = 0, playing = false, lastNow = 0;

  function fit() {
    const k = Math.min(innerWidth / 1080, (innerHeight - 64) / 1920);
    stage.style.transform = `scale(${k})`;
    stage.parentElement.style.width = 1080 * k + 'px';
    stage.parentElement.style.height = 1920 * k + 'px';
  }
  function paint() {
    seek(t);
    scrub.value = (t / duration) * 1000;
    clock.textContent = `${fmt(t)} / ${fmt(duration)}`;
    playBtn.textContent = playing ? '❚❚' : '▶';
  }
  function loop(now) {
    if (playing) {
      t += (now - lastNow) / 1000;
      if (t >= duration) { t = duration; playing = false; }
      paint();
    }
    lastNow = now;
    requestAnimationFrame(loop);
  }
  const toggle = () => { if (t >= duration) t = 0; playing = !playing; paint(); };
  playBtn.onclick = toggle;
  stage.onclick = toggle;
  scrub.oninput = () => { t = (scrub.value / 1000) * duration; paint(); };
  addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); toggle(); } });
  addEventListener('resize', fit);
  fit(); paint(); requestAnimationFrame(loop);
})();
