// Scene 2 – Five foods, one family: they are all carb sources.
import { C, W, div, sticker, text, box, svgEl } from '../engine.js';

export default function sources(ctx) {
  const { root, tl, dur, T } = ctx;
  ctx.bg(C.cream);

  // editorial backdrop: dotted grid + orange slab
  div(root, { position: 'absolute', inset: '-100px', backgroundImage: `radial-gradient(${C.orange}55 5px, transparent 6px)`, backgroundSize: '72px 72px' });
  const slab = box(root, { x: 540, y: 2130, w: 1500, h: 900, bg: C.orange, rot: -6 });
  tl.fromTo(slab, { y: 2700 }, { y: 2130, duration: 0.9, ease: 'power3.out' }, 0.2);

  const tag = text(root, T.tag, { y: 250, size: 84, color: C.cream, bg: C.black, rot: -2 });
  ctx.pop(tag, 0.35, { sound: 'pop' });

  const cx = 540, cy = 890, R = 365;
  const names = ['bread', 'rice', 'potato', 'lentils', 'sugar'];
  const times = [0.75, 1.55, 2.3, 3.1, 4.0];        // follows the voiceover list
  const pos = names.map((_, i) => {
    const a = (-90 + i * 72) * Math.PI / 180;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });

  // connectors (drawn later, sit under the stickers)
  const lines = svgEl(root, { x: 540, y: 960, w: 1080, h: 1920, viewBox: '0 0 1080 1920' },
    pos.map(([x, y]) => `<path d="M${x} ${y} L${cx} ${cy}" fill="none" stroke="${C.black}" stroke-width="10" stroke-dasharray="2 24" stroke-linecap="round"/>`).join(''));
  const linePaths = [...lines.querySelectorAll('path')];
  linePaths.forEach((p, i) => tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 5.25 + i * 0.06));

  names.forEach((name, i) => {
    const [x, y] = pos[i];
    const halo = box(root, { x, y, w: 330, h: 330, bg: i % 2 ? C.orange : C.black, radius: 999 });
    ctx.pop(halo, times[i] - 0.05, { sound: null, dur: 0.4 });
    const s = sticker(root, name, { x, y: y - 10, size: 340, rot: i % 2 ? 7 : -7 });
    ctx.pop(s, times[i]);
    ctx.float(s, { amp: 8, rot: 2.5, period: 2 + i * 0.3 });
    const lab = text(root, T.items[i], { x, y: y + 165, size: 60, font: 'body', color: C.black, bg: C.white, border: `5px solid ${C.black}`, rot: i % 2 ? -4 : 4 });
    ctx.pop(lab, times[i] + 0.12, { sound: null });
    ctx.punch(times[i], 1.035, 0.35);
    // everybody pulses once the badge lands
    tl.to(s, { scale: 1.16, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out' }, 5.5 + i * 0.1);
  });

  const badge = box(root, { x: cx, y: cy, w: 330, h: 330, bg: C.orange, radius: 999, border: `10px solid ${C.black}`, shadow: `10px 12px 0 ${C.black}` });
  const badgeTxt = text(badge, T.badge, { x: 155, y: 150, size: 150, color: C.cream });
  ctx.slam(badge, 4.85, { from: 4, shake: 18 });
  ctx.burst(cx, cy, 5.12, { n: 16, r0: 200, r1: 330, color: C.black, len: 50, w: 10 });
  tl.to(badge, { rotation: 6, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 2 }, 5.4);
  void badgeTxt;

  const line = text(root, T.line, { y: 1500, size: 86, color: C.black, split: true, fit: 960 });
  ctx.words(line, 5.7, { stagger: 0.16 });
  const hl = line.words[line.words.length - 1];
  hl.style.color = C.cream; hl.style.background = C.black; hl.style.padding = '0 .25em'; hl.style.borderRadius = '18px';

  // slab drifts so the layout never sits still
  tl.fromTo(slab, { rotation: -6 }, { rotation: -3, duration: dur, ease: 'none', immediateRender: false }, 0);
}
