// Tiny motion-graphics toolkit on top of GSAP.
// Everything is driven by ONE paused master timeline, so any frame can be
// rendered deterministically with window.__seek(seconds).
import { BRAND as C, VIDEO } from './config.js';
import { STICKERS, wrapArt, hexMarkup } from './stickers.js';

const gsap = window.gsap;
gsap.defaults({ lazy: false, overwrite: false });
gsap.config({ force3D: false, nullTargetWarn: false });

export const W = VIDEO.width, H = VIDEO.height;
export { C };

// ── basics ──────────────────────────────────────────────────────────────
export function div(parent, css = {}) {
  const d = document.createElement('div');
  Object.assign(d.style, css);
  parent.appendChild(d);
  return d;
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Absolutely positioned box whose CENTER sits at (x, y). */
export function at(el, x, y, rot = 0, scale = 1) {
  Object.assign(el.style, { position: 'absolute', left: '0', top: '0' });
  gsap.set(el, { xPercent: -50, yPercent: -50, x, y, rotation: rot, scale });
  el._r = rot; el._s = scale; el._x = x; el._y = y;
  return el;
}

export function box(parent, { x, y, w, h, bg = C.cream, radius = 0, border, shadow, rot = 0, css = {} }) {
  const el = div(parent, {
    width: w + 'px', height: h + 'px', background: bg, borderRadius: radius + 'px',
    border: border || 'none', boxShadow: shadow || 'none', ...css,
  });
  return at(el, x, y, rot);
}

export function svgEl(parent, { x, y, w, h, viewBox, rot = 0 }, inner) {
  const el = div(parent, { width: w + 'px', height: h + 'px' });
  el.innerHTML = `<svg viewBox="${viewBox}" width="100%" height="100%" style="overflow:visible;display:block">${inner}</svg>`;
  return at(el, x, y, rot);
}

// ── stickers ────────────────────────────────────────────────────────────
function recolor(g, color, ow) {
  g.querySelectorAll('path,circle,ellipse,rect,polygon,line,polyline').forEach((n) => {
    const hasStroke = n.getAttribute('stroke') !== 'none';
    const sw = parseFloat(n.getAttribute('stroke-width') ?? 5);
    n.style.fill = n.getAttribute('fill') === 'none' ? 'none' : color;
    n.style.stroke = color;
    n.style.strokeWidth = (hasStroke ? sw : 0) + ow * 2;
  });
}

/** Die-cut sticker: hard shadow + white border + art. Returns outer el; el.inner is free for idle loops. */
export function sticker(parent, name, { x = 0, y = 0, size = 260, rot = 0, outline = 9 } = {}) {
  const art = wrapArt(STICKERS[name]);
  const el = div(parent, { width: size + 'px', height: size + 'px' });
  const inner = div(el, { width: '100%', height: '100%' });
  inner.innerHTML = `<svg viewBox="-24 -24 248 248" width="100%" height="100%" style="overflow:visible;display:block">
    <g class="sh" transform="translate(7 11)" opacity=".3">${art}</g><g class="ol">${art}</g><g>${art}</g></svg>`;
  recolor(inner.querySelector('.sh'), '#000', outline);
  recolor(inner.querySelector('.ol'), C.white, outline);
  el.inner = inner;
  return at(el, x, y, rot);
}

export function hex(parent, { x = 0, y = 0, size = 80, fill, ring, rot = 0 } = {}) {
  const el = div(parent, { width: size + 'px', height: size + 'px' });
  el.innerHTML = hexMarkup(fill, ring);
  return at(el, x, y, rot);
}

// ── typography (Arabic, RTL; words are never split into letters) ───────
export function text(parent, str, o = {}) {
  const { x = W / 2, y = 0, size = 80, font = 'display', color = C.black, weight = 900,
    bg, pad = '0.12em 0.55em', radius = 999, rot = 0, fit, split = false, shadow, border } = o;
  const el = div(parent, {
    position: 'absolute', left: '0', top: '0', whiteSpace: 'nowrap', direction: 'rtl', unicodeBidi: 'isolate', textAlign: 'center',
    fontFamily: font === 'display' ? "'Lalezar','Cairo',sans-serif" : "'Cairo',sans-serif",
    fontWeight: font === 'display' ? 400 : weight, fontSize: size + 'px', lineHeight: 1.35, color,
  });
  el.lang = 'ar';
  if (bg) Object.assign(el.style, { background: bg, padding: pad, borderRadius: radius + 'px' });
  if (border) el.style.border = border;
  if (shadow) el.style.boxShadow = shadow;
  if (split) {
    const ws = str.split(' ');
    ws.forEach((w, i) => {
      const s = document.createElement('span');
      s.textContent = w; s.style.display = 'inline-block';
      el.appendChild(s);
      if (i < ws.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.words = [...el.querySelectorAll('span')];
  } else el.textContent = str;
  if (fit && el.offsetWidth > fit) el.style.fontSize = (size * fit / el.offsetWidth) + 'px';
  return at(el, x, y, rot);
}

// ── scene context: animation presets that also register sound cues ─────
export function makeContext(scene, stage, master, cues) {
  const wrap = div(stage, { position: 'absolute', inset: '0', overflow: 'hidden', visibility: 'hidden' });
  const cam = div(wrap, { position: 'absolute', inset: '0', transformOrigin: '50% 50%' });
  const tl = gsap.timeline();
  master.add(tl, scene.start);
  const hooks = [];
  const dur = scene.dur;

  const ctx = {
    wrap, root: cam, cam, tl, dur, T: scene.text, hooks,
    bg(color) { wrap.style.background = color; },
    /** register a sound effect at scene-local time t */
    sfx(type, t, vol = 1) { cues.push({ type, t: +(scene.start + t).toFixed(3), vol }); },
    /** fn(localTime) runs on every rendered frame – for particles / procedural motion */
    onFrame(fn) { hooks.push(fn); },

    pop(el, t, { dur: d = 0.5, sound = 'pop', vol = 1 } = {}) {
      tl.fromTo(el, { scale: 0, rotation: (el._r || 0) - 28 },
        { scale: el._s ?? 1, rotation: el._r || 0, duration: d, ease: 'back.out(2.4)' }, t);
      if (sound) ctx.sfx(sound, t, vol);
    },
    fly(el, t, { fromX = 0, fromY = -600, spin = 120, dur: d = 0.6, sound = 'pop' } = {}) {
      tl.fromTo(el, { x: el._x + fromX, y: el._y + fromY, rotation: (el._r || 0) + spin, scale: 0.4 },
        { x: el._x, y: el._y, rotation: el._r || 0, scale: el._s ?? 1, duration: d, ease: 'back.out(1.5)' }, t);
      if (sound) ctx.sfx(sound, t + d * 0.55);
    },
    slam(el, t, { from = 3, sound = 'impact', shake = 14 } = {}) {
      tl.fromTo(el, { scale: from, autoAlpha: 0 }, { scale: el._s ?? 1, autoAlpha: 1, duration: 0.26, ease: 'power4.in' }, t);
      if (sound) ctx.sfx(sound, t + 0.26);
      if (shake) ctx.shake(t + 0.26, shake);
    },
    rise(el, t, { dy = 70, dur: d = 0.6, ease = 'power3.out' } = {}) {
      tl.fromTo(el, { y: el._y + dy, autoAlpha: 0 }, { y: el._y, autoAlpha: 1, duration: d, ease }, t);
    },
    words(el, t, { stagger = 0.11, sound = 'tick' } = {}) {
      tl.fromTo(el.words, { y: 70, autoAlpha: 0, rotation: 10 },
        { y: 0, autoAlpha: 1, rotation: 0, duration: 0.45, ease: 'back.out(2)', stagger }, t);
      if (sound) el.words.forEach((_, i) => ctx.sfx(sound, t + i * stagger, 0.6));
    },
    out(el, t, { dur: d = 0.3 } = {}) {
      tl.to(el, { scale: 0, rotation: '+=40', duration: d, ease: 'back.in(2)' }, t);
    },
    float(el, { amp = 14, rot = 3, period = 2.6 } = {}) {
      const target = el.inner || el;
      const half = period / 2;
      tl.fromTo(target, { y: -amp, rotation: -rot },
        { y: amp, rotation: rot, duration: half, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(dur / half) + 1 }, 0);
    },
    shake(t, amp = 14) {
      tl.fromTo(cam, { x: amp, y: -amp * 0.6 }, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1.1,0.25)', immediateRender: false }, t);
    },
    punch(t, s = 1.08, d = 0.4) {
      tl.fromTo(cam, { scale: s }, { scale: 1, duration: d, ease: 'power3.out', immediateRender: false }, t);
    },
    draw(pathEl, t, d = 0.8, ease = 'power2.inOut') {
      pathEl.setAttribute('pathLength', '1');
      pathEl.style.strokeDasharray = '1';
      tl.fromTo(pathEl, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease }, t);
    },
    /** radial burst of short rays */
    burst(x, y, t, { n = 12, color = C.cream, r0 = 90, r1 = 240, len = 70, w = 14, sound } = {}) {
      for (let i = 0; i < n; i++) {
        const arm = div(cam, { position: 'absolute', left: x + 'px', top: y + 'px', width: '0', height: '0', transform: `rotate(${(360 / n) * i}deg)` });
        const ray = div(arm, { position: 'absolute', left: -w / 2 + 'px', top: -len / 2 + 'px', width: w + 'px', height: len + 'px', background: color, borderRadius: w + 'px' });
        tl.fromTo(ray, { y: -r0, scaleY: 0 }, { y: -(r0 + r1) / 2, scaleY: 1, duration: 0.18, ease: 'power2.out' }, t);
        tl.to(ray, { y: -r1, scaleY: 0, duration: 0.28, ease: 'power2.in' }, t + 0.18);
      }
      if (sound) ctx.sfx(sound, t);
    },
  };
  return ctx;
}

// ── scene-to-scene transitions (centered on the cut at time T) ─────────
export function addTransition(master, layer, T, type, cues) {
  const full = { position: 'absolute', left: '0', top: '0', width: W + 'px', height: H + 'px' };
  cues.push({ type: 'whoosh', t: +(T - 0.3).toFixed(3), vol: 1 });
  if (type === 'slide-up' || type === 'slide-left') {
    const axis = type === 'slide-up' ? 'y' : 'x';
    const size = type === 'slide-up' ? H : W;
    [[C.black, 0], [C.cream, 0.07]].forEach(([color, lag]) => {
      const p = div(layer, { ...full, background: color });
      master.fromTo(p, { [axis]: size + 40 }, { [axis]: 0, duration: 0.3, ease: 'power3.in' }, T - 0.34 + lag);
      master.to(p, { [axis]: -size - 40, duration: 0.34, ease: 'power3.out' }, T + 0.04 + lag);
    });
  } else if (type === 'bars') {
    const n = 6, bh = H / n;
    for (let i = 0; i < n; i++) {
      const p = div(layer, { position: 'absolute', left: '0', top: i * bh - 1 + 'px', width: W + 'px', height: bh + 2 + 'px', background: i % 2 ? C.cream : C.black });
      const fromLeft = i % 2 === 0;
      master.fromTo(p, { scaleX: 0, transformOrigin: fromLeft ? '0% 50%' : '100% 50%' },
        { scaleX: 1, duration: 0.26, ease: 'power3.in' }, T - 0.4 + i * 0.022);
      master.set(p, { transformOrigin: fromLeft ? '100% 50%' : '0% 50%' }, T + 0.01);
      master.to(p, { scaleX: 0, duration: 0.3, ease: 'power3.out' }, T + 0.03 + i * 0.022);
    }
  } else { // iris: a disc grows from the centre, then a hole opens in it
    const p = div(layer, { ...full, background: C.black });
    const st = { a: 0, b: 0 };
    const apply = () => {
      const m = `radial-gradient(circle at 50% 50%, transparent ${st.b}px, #000 ${st.b + 2}px, #000 ${st.a}px, transparent ${st.a + 2}px)`;
      p.style.webkitMaskImage = m; p.style.maskImage = m;
    };
    apply();
    master.fromTo(st, { a: 0 }, { a: 1200, duration: 0.34, ease: 'power3.in', onUpdate: apply }, T - 0.36);
    master.fromTo(st, { b: 0 }, { b: 1200, duration: 0.4, ease: 'power3.out', onUpdate: apply, immediateRender: false }, T + 0.03);
  }
}

/** Seeded paper grain so every render worker draws the identical texture. */
export function grain(parent) {
  const c = document.createElement('canvas');
  c.width = 270; c.height = 480;
  const g = c.getContext('2d'), img = g.createImageData(270, 480), r = rng(7);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 90 + r() * 165;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  div(parent, {
    position: 'absolute', inset: '0', backgroundImage: `url(${c.toDataURL()})`, backgroundSize: '100% 100%',
    mixBlendMode: 'multiply', opacity: '0.10', pointerEvents: 'none',
  });
}
