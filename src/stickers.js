// Original illustrated stickers. Each entry is SVG markup drawn in a 200x200 box.
// Shapes inherit a bold ink outline; engine.js adds the white die-cut border + shadow.
// Add a new sticker = add a new key here, then use sticker(parent, 'key', {...}).
const INK = '#1B1B1B';

function cube(x, y, s) {
  const h = s * 0.5;
  return `<path d="M${x} ${y - h} L${x + s} ${y} L${x} ${y + h} L${x - s} ${y}Z" fill="#FFFFFF"/>
  <path d="M${x - s} ${y} L${x} ${y + h} V${y + h + s} L${x - s} ${y + s}Z" fill="#EFE6D8"/>
  <path d="M${x + s} ${y} L${x} ${y + h} V${y + h + s} L${x + s} ${y + s}Z" fill="#D9CDBB"/>`;
}

function dots(list, fill, r = 5) {
  return list.map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr || r}" fill="${fill}" stroke="none"/>`).join('');
}

const lentilMound = (() => {
  const pts = [[62, 92], [80, 80], [100, 74], [120, 80], [138, 92], [70, 104], [90, 96], [110, 96], [130, 104], [100, 108], [84, 112], [118, 112], [52, 106], [148, 106]];
  return pts.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="${i % 3 ? '#E8893B' : '#C4551E'}" stroke-width="3"/>`).join('');
})();

export const STICKERS = {
  bread: `
    <ellipse cx="100" cy="120" rx="86" ry="50" fill="#B96A2C"/>
    <path d="M14 112 C14 62 58 44 100 44 C142 44 186 62 186 112 C186 140 142 150 100 150 C58 150 14 140 14 112Z" fill="#E9A957"/>
    <path d="M36 92 C48 68 76 58 100 58" fill="none" stroke="#F8D699" stroke-width="7"/>
    <path d="M70 82 Q84 100 74 124 M104 76 Q118 98 108 126 M138 82 Q150 100 142 122" fill="none" stroke="#A9581F" stroke-width="6"/>
    ${dots([[52, 112], [90, 68], [126, 66], [160, 108], [124, 136], [60, 134]], '#FFF3E0', 3.5)}`,

  rice: `
    <path d="M30 100 C30 38 170 38 170 100Z" fill="#FFFFFF"/>
    <path d="M62 78 l12 -5 M88 62 l13 3 M112 72 l12 -6 M132 86 l11 4 M76 92 l12 2 M104 90 l12 -3 M94 76 l-10 5 M124 60 l-9 -3" fill="none" stroke="#C9BFAE" stroke-width="4"/>
    <path d="M16 98 H184 C184 150 148 174 100 174 C52 174 16 150 16 98Z" fill="#1B1B1B"/>
    <path d="M27 122 H173" fill="none" stroke="#FFF3E0" stroke-width="8"/>
    <path d="M38 142 H162" fill="none" stroke="#FF6B2B" stroke-width="6"/>
    <rect x="72" y="170" width="56" height="14" rx="5" fill="#1B1B1B"/>`,

  potato: `
    <path d="M36 112 C24 68 68 30 112 42 C164 54 190 96 168 138 C148 176 80 180 54 154 C42 142 40 128 36 112Z" fill="#DDA75C"/>
    <path d="M58 84 C70 62 92 54 112 58" fill="none" stroke="#F3CE8E" stroke-width="8"/>
    <path d="M84 110 q8 6 16 0 M128 92 q7 6 14 1 M112 140 q8 5 15 -1 M66 136 q6 4 11 0" fill="none" stroke="#9C6A2C" stroke-width="5"/>
    ${dots([[148, 122], [96, 82], [72, 112]], '#9C6A2C', 3)}`,

  lentils: `
    <path d="M36 104 C36 56 164 56 164 104Z" fill="#D9742B"/>
    ${lentilMound}
    <path d="M14 100 H186 C186 150 150 176 100 176 C50 176 14 150 14 100Z" fill="#8A4B26"/>
    <path d="M30 128 l12 -12 l12 12 l12 -12 l12 12 l12 -12 l12 12 l12 -12 l12 12 l12 -12 l12 12 l12 -12" fill="none" stroke="#FFF3E0" stroke-width="5"/>
    <rect x="70" y="172" width="60" height="14" rx="5" fill="#8A4B26"/>`,

  sugar: `
    ${cube(100, 62, 38)}
    ${cube(60, 116, 38)}
    ${cube(140, 116, 38)}
    <path d="M168 34 l5 13 l13 5 l-13 5 l-5 13 l-5 -13 l-13 -5 l13 -5Z" fill="#FFD23F" stroke-width="3"/>
    <path d="M30 52 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4 l9 -4Z" fill="#FFD23F" stroke-width="3"/>`,

  apple: `
    <path d="M100 64 C80 46 34 56 36 106 C38 152 74 180 100 166 C126 180 162 152 164 106 C166 56 120 46 100 64Z" fill="#E5383B"/>
    <path d="M56 96 C58 80 68 72 80 70" fill="none" stroke="#FF8A8C" stroke-width="8"/>
    <path d="M100 64 Q102 42 112 30" fill="none" stroke-width="7"/>
    <path d="M112 42 C124 20 150 22 156 30 C148 50 126 54 112 42Z" fill="#4CAF50"/>`,

  banana: `
    <path d="M30 66 C40 132 108 176 174 142 C182 137 180 124 170 122 C120 128 76 104 56 58 C50 44 28 50 30 66Z" fill="#FFD23F"/>
    <path d="M46 78 C60 122 104 150 150 144" fill="none" stroke="#E8A90C" stroke-width="5"/>
    <path d="M30 66 C28 50 50 44 56 58" fill="#7A4B1A"/>
    <circle cx="174" cy="133" r="7" fill="#7A4B1A"/>`,

  candy: `
    <path d="M52 100 L14 70 Q8 100 14 130Z" fill="#FF7EB6"/>
    <path d="M148 100 L186 70 Q192 100 186 130Z" fill="#FF7EB6"/>
    <circle cx="100" cy="100" r="52" fill="#FF3D7F"/>
    <path d="M100 100 C84 84 108 66 124 82 C146 104 112 140 82 124 C54 108 62 62 100 58" fill="none" stroke="#FFFFFF" stroke-width="8"/>`,

  donut: `
    <circle cx="100" cy="104" r="80" fill="#D99A4E"/>
    <path d="M26 96 C22 50 60 22 100 22 C140 22 180 50 176 96 C174 112 160 104 152 116 C144 128 132 112 120 124 C108 136 96 118 84 126 C70 136 62 114 48 120 C36 124 28 112 26 96Z" fill="#FF7EB6"/>
    <circle cx="100" cy="92" r="24" fill="#FFF3E0"/>
    <path d="M56 60 l10 8 M92 40 l12 -4 M134 52 l8 10 M150 84 l10 -6 M52 90 l-4 10 M124 96 l10 6" fill="none" stroke="#FFFFFF" stroke-width="6"/>
    <path d="M72 44 l8 8 M116 38 l4 10 M146 70 l-10 4 M66 100 l10 -2" fill="none" stroke="#FFD23F" stroke-width="6"/>`,

  juice: `
    <path d="M120 96 L146 14" fill="none" stroke="#1B1B1B" stroke-width="16"/>
    <path d="M120 96 L146 14" fill="none" stroke="#E5383B" stroke-width="8"/>
    <path d="M48 52 H152 L138 182 H62Z" fill="#FFFDF7"/>
    <path d="M52 86 H148 L138 182 H62Z" fill="#FFA41B"/>
    <path d="M66 100 L72 160" fill="none" stroke="#FFD27A" stroke-width="7"/>
    <circle cx="156" cy="62" r="28" fill="#FFC233"/>
    <circle cx="156" cy="62" r="17" fill="#FFE08A" stroke-width="3"/>
    <path d="M156 45 V79 M139 62 H173" fill="none" stroke="#F0A30A" stroke-width="3"/>`,

  wheat: `
    <path d="M100 190 C100 150 100 110 100 60" fill="none" stroke="#B8862B" stroke-width="7"/>
    ${[0, 1, 2, 3].map(i => `
      <path d="M100 ${150 - i * 30} C70 ${146 - i * 30} 58 ${122 - i * 30} 64 ${102 - i * 30} C88 ${108 - i * 30} 100 ${126 - i * 30} 100 ${150 - i * 30}Z" fill="#F0B94A"/>
      <path d="M100 ${150 - i * 30} C130 ${146 - i * 30} 142 ${122 - i * 30} 136 ${102 - i * 30} C112 ${108 - i * 30} 100 ${126 - i * 30} 100 ${150 - i * 30}Z" fill="#E3A630"/>`).join('')}
    <path d="M100 62 C84 46 88 22 100 8 C112 22 116 46 100 62Z" fill="#F0B94A"/>`,

  wholebread: `
    <path d="M36 72 C24 38 66 26 100 30 C134 26 176 38 164 72 C162 80 156 84 154 90 V168 Q154 178 144 178 H56 Q46 178 46 168 V90 C44 84 38 80 36 72Z" fill="#9A5A28"/>
    <path d="M52 72 C46 50 74 44 100 46 C126 44 154 50 148 72 C146 80 138 82 138 92 V162 H62 V92 C62 82 54 80 52 72Z" fill="#E0B070" stroke-width="3"/>
    ${dots([[82, 76], [112, 68], [126, 104], [78, 118], [104, 136], [124, 146], [84, 150], [100, 98]], '#7A4B1A', 4)}`,

  carrot: `
    <path d="M100 58 C84 30 62 30 56 40 C70 44 80 52 88 62Z" fill="#3FA34D"/>
    <path d="M100 58 C104 26 122 16 132 20 C124 34 118 46 112 62Z" fill="#4CAF50"/>
    <path d="M100 60 C116 30 144 34 150 44 C134 48 122 56 114 66Z" fill="#3FA34D"/>
    <path d="M64 70 C70 52 130 52 136 70 C142 100 116 168 104 186 C100 192 96 190 94 184 C82 160 58 100 64 70Z" fill="#FF8A1F"/>
    <path d="M74 86 h20 M108 110 h18 M84 132 h16 M100 156 h10" fill="none" stroke="#D96A0B" stroke-width="5"/>`,

  broccoli: `
    <path d="M84 110 H116 L124 180 Q100 192 76 180Z" fill="#8BC34A"/>
    <circle cx="58" cy="92" r="34" fill="#2F9E5B"/>
    <circle cx="142" cy="92" r="34" fill="#2F9E5B"/>
    <circle cx="100" cy="62" r="42" fill="#3FB56A"/>
    <circle cx="100" cy="104" r="30" fill="#2F9E5B"/>
    <path d="M78 52 q8 -12 22 -10 M48 84 q4 -10 14 -10 M132 82 q8 -8 16 -4" fill="none" stroke="#7FD99A" stroke-width="6"/>`,

  liver: `
    <path d="M20 86 C26 46 80 40 122 46 C164 52 190 74 184 106 C180 132 152 136 126 140 C100 144 82 170 54 164 C26 158 14 122 20 86Z" fill="#B23A48"/>
    <path d="M42 80 C54 62 84 58 108 60" fill="none" stroke="#E0707C" stroke-width="8"/>
    <path d="M118 48 C112 80 118 112 126 140" fill="none" stroke="#7E2231" stroke-width="5"/>`,

  muscle: `
    <path d="M16 150 C14 120 36 104 68 108 C78 78 116 68 136 96 C142 76 138 58 132 42 C126 24 140 10 160 12 C180 14 188 32 182 52 C176 76 184 112 174 142 C166 168 130 180 94 178 C58 177 18 174 16 150Z" fill="#F0A878"/>
    <path d="M70 110 C90 98 120 100 136 114" fill="none" stroke-width="5"/>
    <path d="M88 84 C98 76 112 76 122 84" fill="none" stroke="#FFD0B0" stroke-width="7"/>
    <path d="M138 44 H176 M140 28 q18 -8 34 2" fill="none" stroke-width="4"/>
    <path d="M40 150 q30 10 60 6" fill="none" stroke="#C97F52" stroke-width="5"/>`,

  bolt: `<path d="M118 10 L44 112 H92 L76 190 L156 84 H108Z" fill="#FFD23F"/>`,

  star: `<path d="M100 14 L118 82 L186 100 L118 118 L100 186 L82 118 L14 100 L82 82Z" fill="#FFF3E0"/>`,

  bulb: `
    <path d="M100 18 C60 18 38 48 38 80 C38 106 56 118 64 136 V150 H136 V136 C144 118 162 106 162 80 C162 48 140 18 100 18Z" fill="#FFD23F"/>
    <rect x="66" y="150" width="68" height="16" rx="6" fill="#1B1B1B"/>
    <rect x="76" y="166" width="48" height="14" rx="6" fill="#1B1B1B"/>
    <path d="M84 136 V104 L100 90 L116 104 V136" fill="none" stroke-width="5"/>
    <path d="M58 70 C62 50 76 40 90 38" fill="none" stroke="#FFF3B0" stroke-width="7"/>`,
};

export const wrapArt = (art) =>
  `<g stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">${art}</g>`;

// Lightweight glucose molecule (no die-cut border, cheap enough to use as a particle)
export function hexMarkup(fill = '#FFF3E0', ring = '#FF6B2B', ink = INK) {
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow:visible;display:block">
    <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="${fill}" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/>
    <polygon points="50,26 71,38 71,62 50,74 29,62 29,38" fill="none" stroke="${ring}" stroke-width="6" stroke-linejoin="round"/>
  </svg>`;
}
