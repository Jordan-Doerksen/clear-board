# Icon concept: the yard ladder

Status: a sketch for the owner's gate. Nothing in `public/` or `src-tauri/` uses it. Decision record: D-0028.

## Files

| File | Content |
|---|---|
| `icon-ladder.svg` | The master. viewBox 0 0 512 512. For 48 px and larger. |
| `icon-ladder-small.svg` | The small form. viewBox 0 0 16 16. For 16 px and 32 px. |
| `icon-ladder-sheet.png` | The contact sheet. One picture, device scale factor 2. |
| `icon-ladder.notes.md` | This file. |

## The idea

The icon is the Yard, drawn as a track diagram on a lit panel.

- A lead comes in at the lower left.
- The ladder climbs to the right at 45 degrees.
- Three body tracks leave the ladder and run to the right.
- One route is lit: the lead, the ladder, track 2.
- The lead and the tracks run off the panel. The panel is a window on a larger yard.

The drawing has no car, no engine, no signal and no text.

## The two drawings

The master has four shapes on the floor: the lit route, two idle shapes and the edge line. A soft glow sits under the route.

The small form has the same picture: one lead and three branches. It has no edge line and no glow. All its lines are 2 px wide on the 16 px grid, and all its points are on whole pixels. At 16 px the lines are 2 px with 1 px between them. At 32 px the lines are 4 px with 2 px between them.

The master at 16 px gives lines of 1.5 px and an edge line of 0.3 px. The contact sheet shows this. This is the reason for the small form.

| Size | Drawing |
|---|---|
| 16 px, 32 px | small form |
| 48 px, 128 px, 512 px | master |

## Colours

A standalone SVG cannot read a CSS variable. Each value is a copy of the computed value of a Dusk 0.2.0 token. The source is `src/styles/dusk/dusk.tokens.css`. The computed values were read with `getComputedStyle` in Chromium and they agree with the table.

| Value in the SVG | Dusk token | Use |
|---|---|---|
| `#13101b` | `--panel-hi` | The top stop of the floor gradient (master). |
| `#0d0b14` | `--panel-lo` | The bottom stop of the floor gradient (master). The flat floor (small form). |
| `#13101b` to `#0d0b14`, top to bottom | `--panel-fill` | The floor of the master. |
| `#3fbf7a` | `--green` | The lit route. |
| `#3fbf7a` at opacity 0.55 | the colour in `--halo-green`, `rgba(var(--green-rgb), 0.55)` | The glow under the lit route (master only). |
| `#7d8494` | `--grey` | The idle tracks. |
| `#f2c27a` | `--wall-4` (also `--lit`) | The edge line (master only). |

The contact sheet uses `#0a0810` (`--glass`, the window floor) as the dark ground. That value is not in the SVG files.

Colour use follows the Dusk rules. Gold is chrome: it is the edge line only. Green is a state: it is the lit route only. Grey is a neutral lane fill. There is no red.

The lit route is also brighter than the idle tracks, so colour is not the only difference. Contrast on the floor (WCAG 2 ratio, calculated): green 8.0 to 8.3, grey 5.0 to 5.2, gold 11.4 to 11.9.

## Geometry of the master

- Tile: 512 by 512, corner radius 96. At 32 px this is 6 px, the value of `--r-icon`.
- Edge line: 10 wide, inside the tile.
- Levels: lead at y 376, track 1 at y 296, track 2 at y 216, track 3 at y 136. The spacing is 80.
- Ladder: from the foot at (136, 376) to (376, 136). It is on the diagonal of the tile.
- Line width: 48 for all tracks. The space between two tracks is 32.
- Gap between the lit route and an idle track at a switch: 12.
- Glow: a Gaussian blur, standard deviation 14, of the route line.

The picture has point symmetry about the centre of the tile. The foot and the top of the ladder are at the same distance from the centre.

## Maskable export and round crop

The master has a corner radius and an edge line. A maskable PWA icon must fill the square. The maskable export is the master with two changes: remove the element `id="edge"`, and set the radius of the clip rectangle to 0. The contact sheet shows this export in a circle crop, in the 80 percent safe circle and in a rounded-square crop.

All ten corner points of the junctions (the foot, the two switches, the lit turn, the turn into track 3) are inside the 80 percent circle. The largest distance from the centre is 181.3. The radius of the 80 percent circle is 204.8.

A crop cuts only the ends of lines that run off the panel. In the 80 percent circle the lead is short but the foot is visible.

A circle crop of the master without the two changes cuts the edge line. The contact sheet shows this.

## Checks

| Check | Result |
|---|---|
| No `text`, no font, no `image`, no `script`, no `style`, no `use`, no external reference | Pass. Checked by pattern on both files. |
| The page makes no request other than the SVG file | Pass. Checked in Chromium. |
| Each colour value is a Dusk token value | Pass. Checked against computed values. |
| Reads at 16, 32, 48, 128 and 512 px on the Dusk floor and on white | Looked at on the contact sheet and on pixel views at 8 times. |
| Junctions inside the middle 80 percent | Pass. Calculated. |
| Original work | Drawn from the layout of the Yard station in this application. No other mark was used as a source. |

The SVG uses one filter (`feGaussianBlur`) for the glow. The shape reads without it. A renderer that ignores filters shows a flat line of 55 percent green under the route, which the route covers.

## Rounds of repair

1. Tracks with round ends inside the 80 percent circle. Four colour pairs. Result: the picture was small and sat in one corner. The small form read as the letter F. The glow made of stacked lines showed bands.
2. Tracks run off the tile. The ladder is on the diagonal. Result: the picture fills the tile and a crop cuts only line ends. A 16 unit edge line at 55 percent looked brown. A knockout line around the route hid the start of track 1.
3. First contact sheet. Idle tracks became shapes with ends cut parallel to the route. The glow became one blur and moved under the idle tracks. The small form got three branches, points on whole pixels, and moved up 1 px for balance. Result: the master at 16 px was not clear. The small form was clear. The page was too wide and the pixel views ran off it.
4. A version with four body tracks. Result: the idle shape read as the letter F and filled in at 48 px. Rejected. Three tracks stay.
5. Edge line: six widths and strengths. Chosen: 10 wide, solid `--wall-4`. It reads as a lit line at 48 px and at 512 px.
6. Final sheet. The glow now extends past the tile so it does not fade at the ends. The page layout was repaired. The sheet was looked at again in full and in detail.

## Not verified

- No search for similar marks was made. A thick green step on a dark tile can look like a chart icon. This is a risk for the owner's gate.
- Only Chromium rendered the files. Firefox, Safari, a Windows `.ico`, a macOS `.icns` and the Tauri icon generator were not tested.
- No PNG set was generated. `tauri icon` and the PWA manifest were not touched.
- The maskable export is a recipe, tested only on the contact sheet. No device or launcher was tested.
- The behaviour of a renderer that ignores filters is stated from the SVG source, not from a test.
- The high-contrast reading mode and a forced-colours mode were not tested with this icon.

## For the SME

The drawing shows a lead, a ladder and three body tracks as a schematic. It shows no signal aspect and no rule content. The green line means "the lit route" in the Dusk colour system and nothing else. If the SME sees a rule meaning in the picture, that is a note for the SME to give. This file makes no rule claim.
