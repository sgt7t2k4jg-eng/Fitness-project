// Scene 3 – Inside the body: food → digestion → glucose → bloodstream.
import { C, div, sticker, text, box, svgEl, hex, rng } from '../engine.js';

export default function body(ctx) {
  const { root, tl, T } = ctx;
  ctx.bg(C.black);

  // glow rings
  const rings = div(root, { position: 'absolute', left: '-460px', top: '-40px', width: '2000px', height: '2000px', borderRadius: '50%',
    background: `repeating-radial-gradient(circle, transparent 0 78px, ${C.orange}26 78px 84px)` });
  tl.fromTo(rings, { scale: 0.8 }, { scale: 1.25, duration: ctx.dur, ease: 'none' }, 0);

  const title = text(root, T.title, { y: 245, size: 112, color: C.cream, split: true, fit: 960 });
  ctx.words(title, 0.45, { stagger: 0.13 });

  // body group (so the camera can push it aside in phase B)
  const grp = div(root, { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', transformOrigin: '540px 960px' });
  const S = 1.3, BX = 540 - 200 * S, BY = 375;
  const fig = svgEl(grp, { x: 540, y: BY + 450 * S, w: 400 * S, h: 900 * S, viewBox: '0 0 400 900' }, `
    <g fill="${C.cream}" stroke="${C.orange}" stroke-width="10" stroke-linejoin="round">
      <path d="M170 160 H230 V190 C290 195 330 215 335 270 L350 500 C352 528 316 532 312 505 L300 330 L295 520 L290 840 C290 872 224 872 222 840 L205 560 H195 L178 840 C176 872 110 872 110 840 L105 520 L100 330 L88 505 C84 532 48 528 50 500 L65 270 C70 215 110 195 170 190Z"/>
      <circle cx="200" cy="95" r="70"/>
    </g>
    <path id="tube" d="M200 128 V270 C200 296 214 300 224 316" fill="none" stroke="${C.black}" stroke-width="16" stroke-linecap="round"/>
    <path id="stomach" d="M198 306 C232 290 270 312 266 352 C263 390 214 400 192 378 C176 362 178 322 198 306Z" fill="${C.orange}" stroke="${C.black}" stroke-width="8"/>
    <path id="gut" d="M214 400 C150 410 150 440 200 444 C250 448 252 478 200 482 C150 486 150 516 200 520" fill="none" stroke="${C.black}" stroke-width="14" stroke-linecap="round"/>
    <path d="M176 100 q24 20 48 0" fill="none" stroke="${C.black}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="176" cy="78" r="7" fill="${C.black}"/><circle cx="224" cy="78" r="7" fill="${C.black}"/>`);
  ctx.pop(fig, 0.3, { dur: 0.6, sound: 'pop' });
  const stomach = fig.querySelector('#stomach');
  stomach.style.transformOrigin = '225px 345px'; stomach.style.transformBox = 'view-box';
  const mouth = [BX + 200 * S, BY + 104 * S], belly = [BX + 225 * S, BY + 345 * S];

  // bread travels: outside → mouth → stomach
  const bread = sticker(grp, 'bread', { x: 1250, y: 420, size: 300, rot: 20 });
  tl.to(bread, { x: mouth[0], y: mouth[1], scale: 0.3, rotation: -200, duration: 0.8, ease: 'power2.inOut' }, 1.0);
  ctx.sfx('swish', 1.0); ctx.sfx('blip', 1.8);
  tl.to(bread, { x: belly[0], y: belly[1], scale: 0.16, duration: 0.8, ease: 'power1.inOut' }, 1.85);
  tl.to(bread, { autoAlpha: 0, duration: 0.1 }, 2.65);

  // digestion: stomach churns
  tl.to(stomach, { scale: 1.3, duration: 0.2, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 2.65);
  [2.65, 3.05, 3.45].forEach((t) => ctx.sfx('blip', t, 0.8));
  const digest = text(grp, T.digest, { x: 860, y: belly[1], size: 70, font: 'body', color: C.black, bg: C.cream, rot: 5 });
  ctx.pop(digest, 2.75);
  const ptr = svgEl(grp, { x: 705, y: belly[1], w: 110, h: 20, viewBox: '0 0 110 20' },
    `<path d="M108 10 H6" fill="none" stroke="${C.cream}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 18"/>`);
  tl.fromTo(ptr, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 2.85);

  // glucose burst
  const r = rng(11);
  const N = 12;
  const hexes = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + r() * 0.4, d = 230 + r() * 190;
    const h = hex(root, { x: belly[0], y: belly[1], size: 84 + r() * 30 });
    const tx = belly[0] + Math.cos(a) * d, ty = belly[1] + Math.sin(a) * d * 1.15;
    tl.fromTo(h, { scale: 0 }, { scale: 1, x: tx, y: ty, rotation: r() * 200 - 100, duration: 0.7, ease: 'back.out(1.6)' }, 3.85 + i * 0.025);
    tl.to(h, { y: ty + (i % 2 ? 16 : -16), duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 4.6);
    // phase B: every molecule dives into the vessel
    tl.to(h, { x: 1150 + r() * 80, y: 1290 + r() * 60, scale: 0.7, duration: 0.6, ease: 'power2.in' }, 5.75 + i * 0.03);
    hexes.push(h);
  }
  ctx.sfx('impact', 3.85, 0.9); ctx.sfx('sparkle', 3.9);
  ctx.shake(3.85, 16);
  ctx.burst(belly[0], belly[1], 3.85, { n: 14, r0: 80, r1: 300, color: C.orange });

  const glu = text(root, T.glucose, { y: 1490, size: 210, color: C.orange });
  ctx.slam(glu, 4.15, { sound: null, shake: 0 });
  tl.to(glu, { y: 1640, scale: 0.55, duration: 0.5, ease: 'power3.inOut' }, 5.5);
  tl.to(glu, { autoAlpha: 0, duration: 0.25 }, 6.9);

  // ── phase B: zoom out of the body, into the bloodstream ──
  tl.to(grp, { scale: 0.7, y: -335, duration: 0.6, ease: 'power3.inOut' }, 5.4);
  tl.to(title, { autoAlpha: 0, y: 150, duration: 0.3 }, 5.4);
  ctx.sfx('whoosh', 5.35, 0.8);

  const vessel = box(root, { x: 540, y: 1300, w: 1500, h: 400, bg: '#C1121F', rot: -7,
    css: { borderTop: '22px solid #7A0C14', borderBottom: '22px solid #7A0C14', overflow: 'hidden', boxShadow: `0 0 0 10px ${C.cream}` } });
  div(vessel, { position: 'absolute', left: '0', right: '0', top: '0', height: '70px', background: '#E63946', opacity: '.55' });
  tl.fromTo(vessel, { x: 1900 }, { x: 540, duration: 0.6, ease: 'power3.out' }, 5.45);

  const pr = rng(5);
  const cells = Array.from({ length: 11 }, () => {
    const c = div(vessel, { position: 'absolute', left: '0', top: '0', width: '104px', height: '72px', borderRadius: '50%', background: '#FF5A66', border: '6px solid #7A0C14' });
    div(c, { position: 'absolute', left: '26px', top: '18px', width: '40px', height: '24px', borderRadius: '50%', background: '#D62839' });
    return { el: c, seed: pr(), lane: 20 + pr() * 250, speed: 300 + pr() * 160, kind: 'cell' };
  });
  const flow = Array.from({ length: 10 }, (_, i) => {
    const h = div(vessel, { position: 'absolute', left: '0', top: '0', width: '92px', height: '92px' });
    h.innerHTML = hexes[0].innerHTML;
    return { el: h, seed: pr(), lane: 30 + pr() * 230, speed: 420 + pr() * 200, born: 6.2 + i * 0.17, kind: 'hex' };
  });
  ctx.onFrame((t) => {
    [...cells, ...flow].forEach((p, i) => {
      const span = 1700;
      const x = 1560 - (((p.seed * span + p.speed * t) % span));   // right → left
      const y = p.lane + Math.sin(t * 2.2 + i) * 12;
      const s = p.kind === 'hex' ? Math.max(0, Math.min(1, (t - p.born) * 4)) : 1;
      p.el.style.transform = `translate(${x}px,${y}px) rotate(${p.kind === 'hex' ? t * 60 + i * 40 : Math.sin(t + i) * 12}deg) scale(${s})`;
    });
  });
  flow.forEach((p, i) => { if (i < 6) ctx.sfx('tick', p.born, 0.7); });

  const blood = text(root, T.blood, { x: 200, y: 1135, size: 76, font: 'body', color: C.cream, bg: C.red, rot: -7, border: `6px solid ${C.cream}` });
  ctx.pop(blood, 6.3);

  const line = text(root, T.line, { y: 1640, size: 96, color: C.cream, split: true, fit: 960 });
  ctx.words(line, 7.0, { stagger: 0.16 });
  line.words[0].style.color = C.orange;
  ctx.punch(7.0, 1.05, 0.5);
}
