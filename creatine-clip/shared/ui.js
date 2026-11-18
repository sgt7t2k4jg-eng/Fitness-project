// Shared DOM builders for icon-heavy clips (cards, pills, headers, sparkles, scene switching).
// Requires kit.js. Icons live in creatine-clip/icons/<name>.svg (Twemoji, CC-BY 4.0).
(function (root) {
  const K = root.KIT;
  const U = {};
  U.ICONS = '../../icons/';
  U.BOLT = (w, fill = '#0b0d10') => `<svg width="${w}" height="${w * 1.47}" viewBox="0 0 60 88"><path d="M36 0 4 50h20l-6 38 38-54H34z" fill="${fill}"/></svg>`;
  U.CHECK = (w) => `<svg width="${w}" height="${w}" viewBox="0 0 48 48"><path d="M8 25l11 11L40 13" fill="none" stroke="#0b0d10" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  U.CROSS = (w, col = '#fff') => `<svg width="${w}" height="${w}" viewBox="0 0 48 48"><path d="M12 12l24 24M36 12L12 36" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round"/></svg>`;
  U.ARROW = (w, col = '#0b0d10', up = false) => `<svg width="${w}" height="${w}" viewBox="0 0 48 48" style="transform: rotate(${up ? 180 : 0}deg)"><path d="M24 6v34M9 26l15 15 15-15" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  U.SPARK = '<svg viewBox="0 0 40 40"><path d="M20 0c2 12 6 16 20 20-14 4-18 8-20 20-2-12-6-16-20-20C14 16 18 12 20 0z" fill="#c6ff3d"/></svg>';
  U.icon = (name, size) => `<img src="${U.ICONS}${name}.svg"${size ? ` style="width:${size}px;height:${size}px"` : ''}>`;

  U.el = (parent, cls, html = '', style = {}) => {
    const d = document.createElement('div');
    d.className = cls; d.innerHTML = html; Object.assign(d.style, style); parent.appendChild(d); return d;
  };
  // absolutely positioned sticker centred on (cx, cy)
  U.box = (parent, cls, html, cx, cy, w, h = w, style = {}) =>
    U.el(parent, 'abs sticker ' + cls, html, { left: cx - w / 2 + 'px', top: cy - h / 2 + 'px', width: w + 'px', height: h + 'px', ...style });
  U.card = (parent, icon, cx, cy, size = 230) => U.box(parent, 'card', U.icon(icon), cx, cy, size);
  // horizontally centred, auto-width pill
  U.pill = (parent, html, cx, cy, cls = 'bigpill') => {
    const row = U.el(parent, 'abs row', '', { left: cx - 540 + 'px', top: cy - 70 + 'px', height: '140px' });
    return U.el(row, 'sticker ' + cls, html);
  };
  U.header = (parent, n, title, size = 100) => {
    const row = U.el(parent, 'abs row head');
    return { num: U.el(row, 'sticker num', String(n)), title: U.el(row, 'htitle', title, { fontSize: size + 'px' }) };
  };
  U.sparks = (parent, pts) => pts.map(([x, y]) => { const d = U.el(parent, 'abs spark', U.SPARK); d._x = x; d._y = y; return d; });
  U.sparkle = (els, t, at) => els.forEach((d, i) => {
    const p = K.prog(t, at + i * 0.05, 0.6);
    const sc = p > 0 && p < 1 ? Math.sin(p * Math.PI) * (1 + K.rnd(i) * 0.6) : 0;
    d.style.opacity = sc > 0 ? 1 : 0;
    d.style.transform = `translate(${d._x - 35}px, ${d._y - 35}px) scale(${sc.toFixed(3)}) rotate(${p * 90}deg)`;
  });
  // move an element whose own centre sits at (0, 0)
  U.place = (d, x, y, sc = 1, rot = 0) => {
    d.style.opacity = sc > 0.01 ? 1 : 0;
    d.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${Math.max(0, sc).toFixed(4)}) rotate(${rot}deg)`;
  };
  U.fade = (d, p) => { d.style.opacity = p > 0.01 ? 1 : 0; d.style.transform = `scale(${Math.max(0, p).toFixed(4)})`; };
  // RTL grid: rows of card centres, first item on the right
  U.grid = (rows, step, ys) => rows.flatMap((n, r) => Array.from({ length: n }, (_, i) => [540 + ((n - 1) / 2 - i) * step, ys[r]]));

  // Scene switching: scenes fade out over 0.26s after `to`.
  U.scenes = function (container) {
    const list = [];
    return {
      add(from, to, build) { const r = U.el(container, 'abs scene'); list.push({ r, from, to, draw: build(r) }); },
      draw(t) {
        list.forEach((s) => {
          const on = t >= s.from - 0.02 && t < s.to + 0.26;
          s.r.style.display = on ? 'block' : 'none';
          if (!on) return;
          s.r.style.opacity = (1 - K.prog(t, s.to - 0.04, 0.26)).toFixed(3);
          s.draw(t);
        });
      },
    };
  };
  // frames must not be captured before fonts and icons are decoded
  U.boot = function (setTime, DURATION) {
    K.boot(setTime, DURATION);
    window.ready = Promise.all([window.ready, ...[...document.images].map((im) => im.decode())]).then(() => true);
  };

  root.UI = U;
})(window);
