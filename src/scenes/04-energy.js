// Scene 4 – Glucose = energy; the surplus is stored as glycogen (liver + muscles) → athlete lifting.
import { C, W, H, div, sticker, text, box, svgEl, hex } from '../engine.js';

export default function energy(ctx) {
  const { root, tl, dur, T } = ctx;
  ctx.bg(C.orange);

  // ── phase A: energy + storage ──
  const A = div(root, { position: 'absolute', inset: '0' });
  const stripes = div(A, { position: 'absolute', inset: '-200px', background: `repeating-linear-gradient(115deg, transparent 0 90px, ${C.orangeDark}55 90px 180px)` });
  tl.fromTo(stripes, { x: 0 }, { x: -199, duration: dur, ease: 'none' }, 0);

  const big = hex(A, { x: 540, y: 400, size: 360 });
  ctx.pop(big, 0.4);
  tl.to(big, { rotation: 360, duration: 6, ease: 'none' }, 0.9);
  const bolt = sticker(A, 'bolt', { x: 540, y: 400, size: 250, rot: 8 });
  ctx.pop(bolt, 1.0, { sound: 'zap' });
  tl.to(bolt, { scale: 1.18, duration: 0.25, yoyo: true, repeat: 7, ease: 'sine.inOut' }, 1.5);

  const en = text(A, T.energy, { y: 690, size: 260, color: C.cream });
  ctx.slam(en, 1.25, { shake: 20 });
  ctx.burst(540, 400, 1.5, { n: 16, r0: 190, r1: 420, len: 90, color: C.cream });

  const cards = [
    { key: 'liver', label: T.liver, x: 290, rot: -3, t: 2.7 },
    { key: 'muscle', label: T.muscle, x: 790, rot: 3, t: 3.0 },
  ];
  const slots = [];
  cards.forEach((c) => {
    const card = box(A, { x: c.x, y: 1110, w: 440, h: 540, bg: C.cream, radius: 44, border: `8px solid ${C.black}`, shadow: `12px 14px 0 ${C.black}`, rot: c.rot });
    tl.fromTo(card, { y: 2300 }, { y: 1110, duration: 0.6, ease: 'back.out(1.3)' }, c.t);
    ctx.sfx('pop', c.t + 0.3);
    const st = sticker(card, c.key, { x: 212, y: 170, size: 270, rot: c.rot * -2 });
    ctx.float(st, { amp: 6, rot: 2, period: 2.4 });
    text(card, c.label, { x: 212, y: 345, size: 70, font: 'body', color: C.black });
    // glycogen tank: 4 empty slots
    for (let i = 0; i < 4; i++) {
      const sx = 62 + i * 100, sy = 450;
      const slot = hex(card, { x: sx, y: sy, size: 84, fill: 'transparent', ring: 'transparent' });
      slot.style.opacity = '.25';
      slots.push({ card, sx, sy, cx: c.x, rot: c.rot });
    }
  });

  // molecules leave the big hexagon and fill both tanks
  const order = [0, 4, 1, 5, 2, 6, 3, 7];
  order.forEach((si, n) => {
    const s = slots[si];
    const t = 3.6 + n * 0.19;
    const filled = hex(s.card, { x: s.sx, y: s.sy, size: 84 });
    tl.fromTo(filled, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, t + 0.32);
    const fly = hex(A, { x: 540, y: 400, size: 90 });
    const tx = s.cx - 212 + s.sx - 8, ty = 1110 - 270 + s.sy;
    tl.fromTo(fly, { scale: 0 }, { scale: 1, duration: 0.08 }, t);
    tl.to(fly, { x: tx, duration: 0.34, ease: 'power1.in' }, t);
    tl.to(fly, { y: ty, duration: 0.34, ease: 'power2.in' }, t);
    tl.to(fly, { autoAlpha: 0, duration: 0.04 }, t + 0.34);
    ctx.sfx('tick', t + 0.33, 0.9);
  });
  tl.to(big, { scale: 0.55, duration: 1.5, ease: 'power1.in' }, 3.6);
  tl.to(bolt, { autoAlpha: 0, duration: 0.2 }, 3.5);
  tl.to(en, { scale: 0.75, y: 660, duration: 0.4, ease: 'power3.inOut' }, 2.6);

  const gly = text(A, T.glycogen, { y: 1500, size: 150, color: C.cream, bg: C.black, pad: '0 .5em', rot: -2 });
  ctx.slam(gly, 5.0, { shake: 16 });

  // ── phase B: the athlete ──
  const B = div(root, { position: 'absolute', inset: '0', background: C.cream });
  const mask = { r: 0 };
  const setMask = () => { B.style.clipPath = `circle(${mask.r}px at 540px 1000px)`; };
  setMask();
  tl.to(mask, { r: 1300, duration: 0.5, ease: 'power3.inOut', onUpdate: setMask }, 6.1);
  ctx.sfx('whoosh', 6.05);

  div(B, { position: 'absolute', inset: '-100px', backgroundImage: `radial-gradient(${C.orange}44 5px, transparent 6px)`, backgroundSize: '72px 72px' });
  const disc = box(B, { x: 540, y: 1010, w: 860, h: 860, bg: C.orange, radius: 999, border: `10px solid ${C.black}` });
  tl.fromTo(disc, { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 6.25);
  const floor = box(B, { x: 540, y: 1492, w: 900, h: 16, bg: C.black, radius: 8 });
  void floor;

  const SKIN = '#F0A878', INK = C.black;
  const ath = svgEl(B, { x: 540, y: 1000, w: 760, h: 1045, viewBox: '0 0 800 1100' }, `
    <g id="bodyG">
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M370 650 L315 830 L300 1010" stroke="${INK}" stroke-width="92"/>
        <path d="M430 650 L485 830 L500 1010" stroke="${INK}" stroke-width="92"/>
        <path d="M312 850 L300 1000" stroke="${SKIN}" stroke-width="56"/>
        <path d="M488 850 L500 1000" stroke="${SKIN}" stroke-width="56"/>
      </g>
      <path d="M250 1010 H330 Q345 1010 345 1030 V1050 H235 V1030 Q235 1010 250 1010Z M470 1010 H550 Q565 1010 565 1030 V1050 H455 V1030 Q455 1010 470 1010Z" fill="${C.cream}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M290 385 Q400 350 510 385 L470 670 H330Z" fill="${C.cream}" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M330 610 H470 L475 700 H325Z" fill="${INK}" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M352 372 Q400 440 448 372" fill="${SKIN}" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>
      <rect x="378" y="320" width="44" height="60" fill="${SKIN}" stroke="${INK}" stroke-width="12"/>
      <circle cx="400" cy="270" r="66" fill="${SKIN}" stroke="${INK}" stroke-width="12"/>
      <path d="M334 262 C334 190 466 190 466 262 C440 236 360 236 334 262Z" fill="${INK}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M335 262 H465" stroke="${C.orange}" stroke-width="16" stroke-linecap="round"/>
      <path d="M376 296 q24 14 48 0" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="376" cy="278" r="6" fill="${INK}"/><circle cx="424" cy="278" r="6" fill="${INK}"/>
    </g>
    <g id="armsBack" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path id="aL0" stroke="${INK}" stroke-width="74"/><path id="aR0" stroke="${INK}" stroke-width="74"/>
      <path id="aL1" stroke="${SKIN}" stroke-width="50"/><path id="aR1" stroke="${SKIN}" stroke-width="50"/>
    </g>
    <g id="bar">
      <rect x="40" y="-10" width="720" height="20" rx="8" fill="${INK}"/>
      ${[[70, 1], [650, -1]].map(([x]) => `
        <rect x="${x}" y="-125" width="40" height="250" rx="14" fill="${INK}" stroke="${INK}" stroke-width="8"/>
        <rect x="${x + 40}" y="-125" width="40" height="250" rx="14" fill="${C.cream}" stroke="${INK}" stroke-width="10"/>`).join('')}
      <rect x="20" y="-95" width="42" height="190" rx="12" fill="${C.orangeDark}" stroke="${INK}" stroke-width="10"/>
      <rect x="738" y="-95" width="42" height="190" rx="12" fill="${C.orangeDark}" stroke="${INK}" stroke-width="10"/>
      <circle id="hL" cx="215" cy="0" r="34" fill="${SKIN}" stroke="${INK}" stroke-width="12"/>
      <circle id="hR" cx="585" cy="0" r="34" fill="${SKIN}" stroke="${INK}" stroke-width="12"/>
    </g>`);
  tl.fromTo(ath, { y: 2300 }, { y: 1000, duration: 0.55, ease: 'back.out(1.2)' }, 6.3);

  const q = (id) => ath.querySelector(id);
  const L1 = 135, L2 = 140;
  const elbow = (sx, sy, hx, hy, dir) => {
    const dx = hx - sx, dy = hy - sy, d = Math.min(Math.hypot(dx, dy), L1 + L2 - 0.5);
    const a = Math.atan2(dy, dx), k = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
    return [sx + L1 * Math.cos(a + dir * k), sy + L1 * Math.sin(a + dir * k)];
  };
  // rep cycle: explosive press, short lock-out, controlled descent
  const REP0 = 7.0, PERIOD = 1.3, REPS = 3;
  const lift = (t) => {
    const u = (t - REP0) / PERIOD;
    if (u < 0 || u >= REPS) return 0;
    const f = u - Math.floor(u);
    if (f < 0.28) { const k = f / 0.28; return 1 - Math.pow(1 - k, 3); }
    if (f < 0.5) return 1;
    const k = (f - 0.5) / 0.5; return 1 - (k * k * (3 - 2 * k));
  };
  ctx.onFrame((t) => {
    const p = lift(t);
    const dip = (1 - p) * 26;                       // slight knee dip at the bottom
    const by = 372 + dip - p * 225;                 // bar height
    q('#bodyG').setAttribute('transform', `translate(0 ${dip * 0.5})`);
    q('#bar').setAttribute('transform', `translate(0 ${by})`);
    const sy = 405 + dip * 0.5;
    [['L', 302, 215, -1], ['R', 498, 585, 1]].forEach(([s, sx, hx, dir]) => {
      const [ex, ey] = elbow(sx, sy, hx, by, dir);
      const d = `M${sx} ${sy} L${ex} ${ey} L${hx} ${by}`;
      q(`#a${s}0`).setAttribute('d', d); q(`#a${s}1`).setAttribute('d', d);
    });
  });

  const power = text(B, T.power, { y: 300, size: 300, color: C.black });
  for (let i = 0; i < REPS; i++) {
    const top = REP0 + i * PERIOD + 0.3;
    ctx.sfx('swish', REP0 + i * PERIOD, 0.6);
    ctx.sfx('impact', top, i === 0 ? 1 : 0.75);
    ctx.shake(top, 14);
    ctx.burst(540, 520, top, { n: 12, r0: 380, r1: 560, color: C.black, len: 70, w: 12 });
    const z = sticker(B, 'bolt', { x: i % 2 ? 170 : 910, y: 700 + i * 60, size: 190, rot: i % 2 ? -18 : 18 });
    ctx.pop(z, top, { sound: 'zap', vol: 0.6 });
    if (i < REPS - 1) ctx.out(z, top + 0.75);
    if (i === 0) ctx.slam(power, top - 0.26, { sound: null, shake: 0 });
    else tl.fromTo(power, { scale: 1.22 }, { scale: 1, duration: 0.35, ease: 'power3.out', immediateRender: false }, top);
  }

  const fuel = text(B, T.fuel, { y: 1590, size: 78, font: 'body', color: C.cream, bg: C.black, rot: -2, fit: 960 });
  ctx.pop(fuel, 8.5);
}
