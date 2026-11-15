// Scene 6 – Slow-digesting carbs: calm orbit, fibre strands, steady energy, lasting satiety.
import { C, div, sticker, text, box, svgEl } from '../engine.js';

export default function slow(ctx) {
  const { root, tl, dur, T } = ctx;
  ctx.bg(C.cream);

  // soft drifting blobs
  [[160, 300, 520, C.orange + '30'], [940, 1050, 640, C.green + '26'], [200, 1700, 560, C.orange + '26']].forEach(([x, y, s, col], i) => {
    const b = box(root, { x, y, w: s, h: s, bg: col, radius: 999 });
    tl.to(b, { x: x + (i % 2 ? -70 : 70), y: y + 50, duration: dur, ease: 'sine.inOut' }, 0);
  });

  const title = text(root, T.title, { y: 255, size: 210, color: C.black, fit: 900 });
  ctx.rise(title, 0.45, { dur: 0.9 });
  ctx.sfx('pad', 0.4);

  // orbit of whole foods around the fibre core
  const cx = 540, cy = 830, R = 335;
  const ring = box(root, { x: cx, y: cy, w: R * 2, h: R * 2, bg: 'transparent', radius: 999, border: `6px dashed ${C.black}55` });
  tl.fromTo(ring, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: 'power2.out' }, 0.6);
  tl.to(ring, { rotation: 40, duration: dur, ease: 'none' }, 0.6);

  const names = ['wheat', 'rice', 'potato', 'lentils', 'broccoli', 'apple'];
  const times = [1.0, 2.2, 2.95, 3.75, 4.55, 5.3];   // follows the voiceover list
  const foods = names.map((name, i) => {
    const s = sticker(root, name, { x: cx, y: cy, size: 310, rot: i % 2 ? 6 : -6 });
    tl.fromTo(s, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'power3.out' }, times[i]);
    ctx.sfx('chime', times[i], 0.8);
    return { el: s, born: times[i], base: -90 + i * 60 };
  });
  ctx.onFrame((t) => foods.forEach((f) => {
    const grow = Math.max(0, Math.min(1, (t - f.born) / 0.9)), e = 1 - Math.pow(1 - grow, 3);
    const a = (f.base + t * 9) * Math.PI / 180;
    window.gsap.set(f.el, { x: cx + Math.cos(a) * R * e, y: cy + Math.sin(a) * R * e });
  }));

  // fibre core
  const core = box(root, { x: cx, y: cy, w: 300, h: 300, bg: C.green, radius: 999, border: `8px solid ${C.black}`, shadow: `8px 10px 0 ${C.black}` });
  tl.fromTo(core, { scale: 0 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1,0.6)' }, 5.9);
  ctx.sfx('pop', 5.9); ctx.sfx('sparkle', 6.0, 0.7);
  const strands = svgEl(core, { x: 142, y: 142, w: 240, h: 240, viewBox: '0 0 240 240' },
    [50, 90, 150, 190].map((y) => `<path d="M24 ${y} C60 ${y - 34} 84 ${y + 34} 120 ${y} C156 ${y - 34} 180 ${y + 34} 216 ${y}" fill="none" stroke="${C.cream}" stroke-width="12" stroke-linecap="round" opacity=".55"/>`).join(''));
  strands.querySelectorAll('path').forEach((p, i) => ctx.draw(p, 6.1 + i * 0.15, 1.1, 'sine.inOut'));
  const fib = text(core, T.fiber, { x: 142, y: 138, size: 92, color: C.cream });
  ctx.rise(fib, 6.2, { dy: 30, dur: 0.6 });
  tl.to(core, { scale: 1.06, duration: 1.1, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 6.9);

  // steady-energy chart
  const c1 = box(root, { x: 285, y: 1450, w: 470, h: 350, bg: C.white, radius: 40, border: `7px solid ${C.black}`, shadow: `8px 10px 0 ${C.black}`, rot: -2 });
  ctx.rise(c1, 6.6, { dy: 160, dur: 0.9 });
  ctx.sfx('swish', 6.6, 0.5);
  const g = svgEl(c1, { x: 228, y: 205, w: 400, h: 200, viewBox: '0 0 400 200' }, `
    <path d="M10 160 H390" stroke="${C.black}" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round" fill="none"/>
    <path id="curve" d="M10 160 C80 150 110 84 190 76 C270 70 320 96 390 104" fill="none" stroke="${C.green}" stroke-width="18" stroke-linecap="round"/>`);
  ctx.draw(g.querySelector('#curve'), 7.0, 2.2, 'sine.inOut');
  text(c1, T.steady, { x: 228, y: 62, size: 46, font: 'body', color: C.cream, bg: C.black });

  // satiety meter
  const c2 = box(root, { x: 795, y: 1450, w: 470, h: 350, bg: C.white, radius: 40, border: `7px solid ${C.black}`, shadow: `8px 10px 0 ${C.black}`, rot: 2 });
  ctx.rise(c2, 6.9, { dy: 160, dur: 0.9 });
  const tank = box(c2, { x: 228, y: 120, w: 380, h: 96, bg: C.cream, radius: 48, border: `7px solid ${C.black}`, css: { overflow: 'hidden' } });
  const fill = div(tank, { position: 'absolute', left: '0', top: '0', bottom: '0', width: '100%', background: C.orange, transformOrigin: '100% 50%' });
  tl.fromTo(fill, { scaleX: 0.04 }, { scaleX: 1, duration: 2.3, ease: 'sine.inOut' }, 7.4);
  ctx.sfx('fill', 7.4);
  const full = text(c2, T.full, { x: 228, y: 250, size: 50, font: 'body', color: C.black, fit: 400 });
  ctx.rise(full, 8.3, { dy: 30 });
  const ok = box(c2, { x: 420, y: 30, w: 96, h: 96, bg: C.green, radius: 999, border: `7px solid ${C.black}` });
  ok.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M26 52 L44 70 L76 34" fill="none" stroke="${C.cream}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  ctx.pop(ok, 9.5, { sound: 'chime' });

  // gentle camera drift
  tl.fromTo(ctx.cam, { scale: 1.04 }, { scale: 1, duration: dur, ease: 'sine.out' }, 0);
}
