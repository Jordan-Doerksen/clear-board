# Icon concept: the monogram

Status: a sketch. The owner picks at the gate. No file in `public/` or `src-tauri/` uses this drawing.

## Files

| File | Use |
| --- | --- |
| `icon-mark.svg` | The master. viewBox 0 0 512 512. Use it at 32 px and larger. |
| `icon-mark-small.svg` | The 16 px drawing. viewBox 0 0 16 16. |
| `icon-mark-sheet.png` | The contact sheet. Scale factor 2. |

## The idea

1. The icon is one letter C. The C holds one board.
2. The C is one line of one weight. It has straight runs and 45 degree corners only, as a line on a track diagram has.
3. The line is the Dusk lit line: gold, with a glow on the near-black floor.
4. The board is a small square tile at the centre of the icon. The mouth of the C is as high as the board.
5. The 16 px drawing keeps the same two parts. It does not fall back to a letter alone.

The letter is a drawn path. The files contain no text element, no font, no external reference, no raster image and no script.

## The green board: SME to confirm

The board is green because the present header mark is a green dot (`.mark span` in `src/index.css`, the colour `--clear`). The board is a square tile. It is not a lamp, it is not on a mast, and the drawing shows no arrangement of lamps. The drawing cites no rule and teaches no aspect.

A reader can still connect a green square with a signal colour. The SME must confirm that a green square tile is acceptable in an identity mark.

If the SME does not confirm, change the fill of the board and of its glow to `--ink` (`#f4f1ec`). No geometry changes. This alternative was drawn in a first sketch only. It is not on the contact sheet.

## The drawing, part by part

Units are those of the 512 viewBox.

| Part | Geometry | Paint |
| --- | --- | --- |
| Floor | Square 512, corner radius 96 | `#0a0810` |
| Glow of the line | The path of the C, stroke 32, blur 24, clipped to the floor | `#e0864a` at opacity 0.50 |
| Glow of the board | The square of the board, blur 20, clipped to the floor | `#3fbf7a` at opacity 0.55 |
| The C | One open path, stroke 56, mitre joins, butt ends. Outline 96 to 416 on each axis. Corners cut at 45 degrees, 64 units on each axis | `#f2c27a` |
| Board | Square 96 at 208,208, corner radius 12 | `#3fbf7a` |

The proportions come from one number, the line weight of 56:

- Line 56, clear space 56, board 96, clear space 56, line 56. The sum is 320, the width of the C.
- The mouth of the C is 96 high, the same as the board.
- The two ends of the C turn in by 20 units past the corner. They are the parts that hold the board.

The small drawing has three parts and no glow: the floor (square 16, corner radius 3), the C (stroke 3, outline 1 to 15) and the board (square 4 at 6,6). The C fills more of the tile than in the master, because a tab icon has no room for a margin.

## Colours and their Dusk tokens

The source is `src/styles/dusk/dusk.tokens.css` (Dusk 0.2.0). A standalone SVG cannot read a CSS variable, so each value is a copy. The computed values were read in Chromium with `getComputedStyle`.

| Value | Dusk token | Where |
| --- | --- | --- |
| `#0a0810` | `--glass` | The floor (master and small) |
| `#f2c27a` | `--wall-4`, also `--lit` | The C (master and small) |
| `#e0864a` | `--wall-3` | The glow of the line (master) |
| `#3fbf7a` | `--green`, also `--up` | The board (master and small). The glow of the board (master) |

No other colour value is in either file. Opacity is separate from colour:

- 0.50 on `--wall-3` is the opacity of the same colour in the Dusk `--neon` shadow.
- 0.55 on `--green` is the opacity of the same colour in the Dusk `--halo-green` shadow.
- The C is `--wall-4` at full opacity, as in `--neon-ctl-on`. The token `--lit-line` is the same colour at opacity 0.55. That value is too weak for a letter.
- The blur sizes (24 and 20 units) are not Dusk values. They are set by eye for a 512 unit drawing.

Colour roles agree with the fence. Gold is chrome: the letter of the brand, drawn as the lit line. Green is a fill for a tile and its glow. Red is not in the drawing. Shape and position carry the two parts. Colour is not the only difference between them.

## Measured contrast (WCAG 2 ratio, calculated from the values)

| Pair | Ratio |
| --- | --- |
| The C `#f2c27a` on floor `#0a0810` | 12.11 |
| Board `#3fbf7a` on floor `#0a0810` | 8.48 |
| Floor `#0a0810` on white | 19.90 |
| The C `#f2c27a` on white | 1.64 |
| Board `#3fbf7a` on white | 2.35 |
| The C `#f2c27a` against board `#3fbf7a` | 1.43 |

On a white ground the dark floor carries the outline. The C and the board always sit on the floor, never on the ground behind the icon. The C and the board do not touch: 56 units of floor are between them in the master, and 2 px in the small drawing.

## Sizes

| Size | Drawing | What the pixels do |
| --- | --- | --- |
| 512, 128 | Master | The glow shows as a soft light on the floor. |
| 48 | Master | The line is 5.25 px. The board is 9 px. Edges are not on whole pixels. The drawing reads. |
| 32 | Master | One pixel is 16 units. The outline of the C and the board are on whole pixels. The line is 3.5 px, so its inner edge is on a half pixel and is soft. The glow is a faint rim. |
| 16 | Small | The line is 3 px. The board is 4 px. The space between them is 2 px. The mouth is 4 px. The horizontal and vertical edges are on whole pixels. The 45 degree corners are soft, as all diagonals are at this size. |

The master at 16 px is on the sheet for comparison only. Its line is 1.75 px and its glow is noise. Do not use it at 16 px.

## The safe zone

- A maskable icon keeps a circle with a radius of 40 percent of the icon: 204.8 units.
- The farthest point of the C from the centre is 178.2 units (measured from a render of the master without its glow).
- The margin is 26.6 units, 5.2 percent of the icon.
- A circle crop, a rounded-square crop and a crop to the safe zone cut only the glow and the floor. The sheet shows the three crops.

The master has round corners, so the area outside them is transparent. A maskable export needs a square floor: set the corner radius of the floor and of the clip to 0. No export file exists yet.

## Rounds of repair

Each round was a render in Chromium, a look at the picture and a change.

| Round | Seen | Change |
| --- | --- | --- |
| Sketches | A round C was a common shape and was soft at small sizes. A board in the mouth of the C made the letter read as an E. Two letters, C and B, did not read below 32 px. | One C with 45 degree corners. The board is at the centre, clear of the line. |
| 1 | At 32 px a tight gold glow and a wide glow made the edges of the line soft. The master at 16 px did not read. | One wide glow only, from a narrow stroke. A separate 16 px drawing. |
| 2 | The line of 48 was thin at 32 px. A larger C with a line of 64 came within 9 units of the safe-zone circle and looked tight in the crop. The 16 px line of 2 px was weak in a tab strip. | The 16 px line became 3 px. The master went back to the 320 unit outline. |
| 3 | A line of 64 on the 320 outline left 48 of clear space and looked heavy. | Line 56, clear space 56. The corner radius of the board went from 16 to 12, nearer to the sharp corners of the C. |

Position: the C is centred on its outline and the board is at the exact centre of the icon. The mass of the C is 13.5 units left of centre, because the mouth is open. A shift of the C to the right moves its edges off whole pixels at 32 px, so it was not made.

## Not verified

- The SME has not confirmed the green board.
- No search of trademark registers or logo collections was made. The drawing is new work from a geometric construction. No known mark was used as a source.
- The files were rendered in Chromium only. Firefox, Safari, the `tauri icon` tool and the icon services of each operating system were not tested. The blur filter is the part most likely to differ.
- No PNG, ICO or ICNS export exists. The maskable export with a square floor does not exist.
- The crops on the sheet are CSS clips of the master. No device or launcher was used.
- No test was made with people. No test was made for colour vision deficiency or for a forced-colours mode.
- `npm run check` and `npm run build` were not run. This job changes no code.
