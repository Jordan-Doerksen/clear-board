# Icon concept: the lit lamp

Status: a sketch. The owner picks at the gate. No file in `public/` or `src-tauri/` uses this drawing.

## Files

| File | Use |
| --- | --- |
| `icon-lamp.svg` | The master. viewBox 0 0 512 512. |
| `icon-lamp-small.svg` | The 16 px drawing. viewBox 0 0 16 16. |
| `icon-lamp-sheet.png` | The contact sheet. Scale factor 2. |

## The idea

1. The icon is the present header mark, made larger: one round lamp, lit, on a dark panel.
2. The panel has the gold lit line that Dusk puts on each container.
3. The panel sits on the Dusk floor. The lit line puts a glow on the floor.
4. There is one lamp only. The drawing is not a signal head and shows no arrangement of lamps.

## The green lamp: SME to confirm

The lamp is green because the header mark is green and the app name is a trade name. A reader can take a green lamp for a rule convention. The drawing cites no rule and teaches no aspect. The SME must confirm that one green lamp is acceptable as an identity mark. If the SME does not confirm, the lamp colour must change before the icon ships.

## The drawing, part by part

Units are those of the 512 viewBox.

| Part | Geometry | Paint |
| --- | --- | --- |
| Floor | Square 512, corner radius 96 | `#0a0810` |
| Glow of the lit line, wide | The panel outline, stroke 30, blur 20, clipped to the floor | `#e0864a` at opacity 0.50 |
| Glow of the lit line, near | The panel outline, stroke 22, blur 8, clipped to the floor | `#f2c27a` at opacity 0.38 |
| Panel | Square 304 at 104,104, corner radius 56 | Gradient `#13101b` (top) to `#0d0b14` (bottom) |
| Lamp glow | Circle, radius 138, clipped to the panel | `#3fbf7a`, opacity 0.50 at radius 94, 0.18 at radius 113, 0 at radius 138 |
| Lit line | The panel outline, stroke 16 | `#f2c27a` |
| Lamp seat | Circle, radius 96 | `#07060b` |
| Lamp | Circle, radius 80 | `#3fbf7a` |
| Lamp core | Circle, radius 80 | `#ffffff`, opacity 0.22 at the centre, 0 at radius 56 |

The lit line and the visible ring of the lamp seat have the same weight: 16 units.
At 32 px, 16 units are 1 px. The lit line, the seat and the lamp fall on whole pixels at 32 px.

The small drawing has three parts: the panel with a 1 px lit line (`#13101b`, `#f2c27a`), a halo of radius 5.5 (`#3fbf7a` at opacity 0.30) and a lamp of radius 4 (`#3fbf7a`). It has no floor, no blur and no gradient.

## Colours and their Dusk tokens

The source is `src/styles/dusk/dusk.tokens.css` (Dusk 0.2.0). A standalone SVG cannot read a CSS variable, so each value is a copy. The computed values were read in Chromium with `getComputedStyle`.

| Value | Dusk token | Where |
| --- | --- | --- |
| `#0a0810` | `--glass` | The floor (master) |
| `#13101b` | `--panel-hi` | The panel, top stop (master). The panel (small) |
| `#0d0b14` | `--panel-lo` | The panel, bottom stop (master) |
| `#f2c27a` | `--wall-4`, also `--lit` | The lit line (master and small). The near glow (master) |
| `#e0864a` | `--wall-3` | The wide glow of the lit line (master) |
| `#3fbf7a` | `--green`, also `--up` | The lamp and its glow (master and small) |
| `#07060b` | `--well` | The lamp seat (master) |
| `#ffffff` | `--on-tile` | The lamp core, at low opacity (master) |

No other colour value is in either file. Opacity is separate from colour:

- 0.50 on `--wall-3` and 0.38 on `--wall-4` are the opacities of the same colours in the Dusk `--neon` shadow.
- 0.50, 0.30, 0.18 and 0 on `--green` are not Dusk values. The Dusk `--neon-green` glow uses 0.62. The lower values keep the edge of the lamp sharp at small sizes.
- 0.22 on `--on-tile` is not a Dusk value. The nearest Dusk value is 0.28, the top light of a tile cap.
- The lit line is `--wall-4` at full opacity, as in `--neon-ctl-on`. The token `--lit-line` is the same colour at opacity 0.55. That value is too weak for a 1 px line at 32 px.

Colour roles agree with the fence. Gold is chrome: the edge of the panel. Green is a fill for a dot and a glow. Red is not in the drawing.

## Measured contrast (WCAG 2 ratio, calculated from the values)

| Pair | Ratio |
| --- | --- |
| Lamp `#3fbf7a` on panel `#13101b` | 8.0 |
| Lamp `#3fbf7a` on seat `#07060b` | 8.6 |
| Lit line `#f2c27a` on floor `#0a0810` | 12.1 |
| Lit line `#f2c27a` on panel `#13101b` | 11.4 |
| Floor `#0a0810` on white | 19.9 |
| Lit line `#f2c27a` on white | 1.6 |

On a white ground the lit line does not carry the outline. The dark floor (master) or the dark panel (small) carries it.

## Sizes

- 512, 128 and 48 px: use the master.
- 32 px: the master is sharp. The small drawing is larger in the frame. The sheet shows the two.
- 16 px: use the small drawing. In the master at 16 px the lit line is 0.5 px and becomes dim, and the lamp is 5 px.
- Browser tab: the sheet shows the two drawings at true size in a dark strip and in a light strip. The small drawing is the stronger one.

## Maskable and round crop

- The lit line, the panel and the lamp are inside the middle 80 percent. The farthest point of the lit line is 200 units from the centre. The limit is 205 units.
- Only the floor and the glow of the lit line are outside that circle.
- The sheet shows four crops at 128 px: a circle on the full image, a circle on the middle 80 percent only, and two rounded squares.
- The floor of the master has round corners (radius 96). For a maskable manifest entry, set the corner radius of the floor to 0 so that the floor fills the square. This is the only change. The picture inside does not change.

## Rounds of repair

| Round | What the sheet showed | Repair |
| --- | --- | --- |
| 1 | The lamp was small in the frame. The glow made the edge of the lamp soft at 32 px. The core made the green pale. The sheet rows wrapped. | Lamp radius 64 to 80. A dark seat behind the lamp. Less glow. Core opacity 0.30 to 0.22. Sheet layout. |
| 2 | The lamp glow touched the lit line. The seat ring (12 units) and the lit line (16 units) had different weights. | Glow radius 150 to 138. Seat radius 92 to 96. |
| 3 | In the small drawing the lamp was 6 px of 16 and weak in a tab. The pixel view was not at 8 times. | Small lamp radius 3 to 4, halo 4.5 to 5.5. Pixel view repaired. |
| 4 | No defect found at 16, 32, 48, 128 or 512 px on the two grounds. | None. |

## Not verified

- Originality. The drawing was made from the header mark and the Dusk tokens only. No search for similar marks was done. A green dot on a dark rounded square is a common form.
- Renderers. Only Chromium (Playwright) made the pictures. Firefox, Safari, resvg and the Tauri icon tool were not tested. The master uses `feGaussianBlur` and `clipPath`. A renderer without filter support shows two flat rings in place of the glow.
- Real surfaces. No test on an installed PWA, a phone launcher, a desktop dock, a taskbar or a real browser tab. The tab strip in the sheet is a mock.
- Display scale. The 16 px and 32 px pixel views are at scale factor 1 only.
- Colour vision. No simulation of colour-vision deficiency was done. The lamp has high luminance contrast with the panel (8.0), so the shape does not depend on hue.
- High-contrast and forced-colours modes. Not tested.
- The SME has not seen the green lamp.
