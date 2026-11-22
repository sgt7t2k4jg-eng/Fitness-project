# Instagram posts and images

Everything here renders to `Exports/` with headless Chromium (`NODE_PATH=/opt/node-tools/node_modules` in the cloud container).

## Card post design (saved design — reuse for new posts)

The design of the "أفضل 5 مصادر البروتين" post. Template: `card-post.html`; content: one file per post in `posts/`.

- **Size:** 1080×1350 (Instagram 4:5), one JPG per slide.
- **Colours:** background `#131317` with a soft orange glow at the top; inner card `#1e1e24`, radius 56px; accent orange `#f0873a`; grey pill `#2b2b33`; secondary text white at 50–55% opacity.
- **Font:** Cairo 900 (700 for small grey text), from `../fonts/`.
- **Header on every slide:** page counter `1/7` top-left; `yassinerahou3` + round profile photo top-right.
- **Slide 1:** title only — line 1 white (120px), line 2 orange (260px). Nothing else.
- **Item slides:** 3D image (210px) → name (116px, white) → small grey line (serving) → big orange number (210px) → orange label → grey pill → short grey line. Bottom: `سوايبي ←` (orange, right) and an optional note (grey, left).
- **Last slide:** `نصيحة` title in orange, 1–2 short paragraphs, then a grey box with a call to action and لايك / فلو / كومنت / سيف icons (save icon in orange).
- **Images:** Fluent Emoji 3D style (`../food3d/`), or an SVG drawn in the same style (e.g. `tuna.svg`).

### Make a new post in this design

1. Copy `posts/protein.js` to `posts/<name>.js` and change `cover`, `items`, `note` and `tip`. Each item has `name`, `img`, `serving`, `big`, `label`, `pill`, `tag`.
2. Render: `node creatine-clip/thumbnails/carousel.js <name>` → `Exports/<name>-carousel/01.jpg …`.

The number of slides follows the number of items (cover + items + last slide).

## Other renders

| Command | Output |
|---|---|
| `node creatine-clip/thumbnails/carousel.js bro` | BRO SPLIT program post (black/gold), `Exports/bro-split-carousel/` |
| `node creatine-clip/thumbnails/carousel.js ul` | UPPER / LOWER program post, `Exports/upper-lower-carousel/` |
| `node creatine-clip/thumbnails/render.js carbs` | Video thumbnail, `Exports/carbs-thumbnail.jpg` |
| `node creatine-clip/thumbnails/render.js week-plan week-plan.jpg` | Weekly plan image |

## Private files (not in git)

`photos/` holds the user's own photos: `carbs.jpg` (thumbnail), `profile-screenshot.png` and the round `avatar.png` cropped from it (used in the card-post header). They are git-ignored; put them back there before re-rendering.
