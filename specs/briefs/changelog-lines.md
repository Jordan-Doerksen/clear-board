# Change lines of each job of Wave 2 (compiled by the lead for job D1)

Each line comes from the report of the job named in its heading. A build report gives "changelog";
a review report gives "learnerVisibleChanges" (what a learner sees). The lead did not edit the lines.
D1 groups them into one entry for 2.0.0 and writes them in the voice of the changelog.

## Wave 2a, review (wf_38c99cb2-401)

- [learnerVisibleChanges] Shell colours and edges: page ground rgb(14, 17, 22) to rgb(10, 8, 16), panels and buttons on Dusk grounds, thin gold edges, text in the Dusk ink. The brief asks for it (section 3.0).
- [learnerVisibleChanges] A faint warm glow low in the window (the Dusk horizon). The brief asks for it (HORIZON, option a); lowest text pair over it 6.61.
- [learnerVisibleChanges] Links, '← Home' and a summary are gold, not blue. The focus ring is rgb(159, 196, 255), still 3 px. The brief asks for it (requirement 10).
- [learnerVisibleChanges] The corner of a panel is 8 px, not 14 px (lede, path, card, ref-detail, prompt, feedback, radio readout, dialog). The brief asks for it (--r; requirement 17). The seven pill corners are as before.
- [learnerVisibleChanges] The fill of the path bar is one flat green, not a gradient (requirement 9). The right and wrong option washes, the tip link hover wash and the dialog scrim read Dusk tokens (requirement 9).
- [learnerVisibleChanges] The search placeholder is brighter (6.52). The edges of the search field, the toggle track and the two bar tracks are brighter (4.14 or more). 'Reset' is 5.38 in both modes. The brief asks for it (requirements 14, 15, 20).
- [learnerVisibleChanges] Native parts are dark (color-scheme dark; the Yard selects compute it also). The brief expects it (section 3.0).
- [learnerVisibleChanges] High contrast mode: the new mapping of block 5 (white ink, brighter edges). The brief asks for it.
- [learnerVisibleChanges] Dyslexia mode: the letter spacing and the word spacing now reach each button, input and select, in the shell and in the two islands. Controls get wider (Yard job select 310 to 337 px, 'Work it' 84.5 to 90 px) and the Reference page gets longer (21,433 to 22,095 px at 1440). No sideways scroll. The brief asks for the rule (requirement 29, DYS-SPACING); section 3.0 does not list this effect inside the islands.
- [learnerVisibleChanges] The tab icon and the manifest icon are the monogram. The browser bar colour and the manifest colours are #0a0810. The brief asks for it (requirements 23, 25).
- [learnerVisibleChanges] Offline cache list: 14 entries, each one time; icons.svg is gone, icon.svg is new. The brief asks for it (requirement 2).
- [learnerVisibleChanges] The Yard and the guided Radio keep their old palettes; the ground around them is the new page ground. The brief expects it in 2a.
- [learnerVisibleChanges] Not changed for a learner: each word, control, id and class; the size of each control and of each text; each margin; the page column; the face drawn on this machine (Inter on both builds); the Yard behaviour (same readout, banner words, refusals and canvas pixels for the same actions on both builds); the Radio test (28 states equal).
- [learnerVisibleChanges] No visible effect: the empty home mark button and the five toggle inputs compute font size 16 px, not 13.33 px; each box is equal.

## Wave 2a, review (wf_288e832c-ebe)

- [learnerVisibleChanges] Nothing that a learner can see, hear or store changed. Words, controls, layout boxes, the canvas, sounds, stored values and the 15 pictures are equal. The brief asks for exactly that.
- [learnerVisibleChanges] Not visible, and asked for by the brief: each Yard class has the prefix `yd-`; the element `style#yard-style` is gone and the style is the file `yardSim-CghD8DsV.css` of the Yard chunk; the frame has `data-cb="yard-drawing"`; the canvas has the class `yd-view`; seven inline styles are classes.
- [learnerVisibleChanges] Not visible, a side effect of requirement 15: inside the Yard the names `--ink`, `--line` and `--bg` now compute to the shell values (for example `--ink` #e6edf3, and #fff with high contrast on). No rule in the Yard reads them today: each computed style value is equal in 30 states, with the three reading modes on also.
- [learnerVisibleChanges] Not visible, not asked for by name: the two toolbar rows compute `background-position: 0px 0px` in place of `0% 0%`. Cause: the build writes `background: none` as `background: 0 0`. The rows have no background image.
- [learnerVisibleChanges] Possible for a learner, not tested: the Yard chunk has a new name and now needs a second file (the style). An app that is open during a release can show a blank Yard (trap 16; rows U-07 and U-10).

## Wave 2a, review (wf_23152989-11f)

- [learnerVisibleChanges] None. dist/ of the branch (860962c and fc53e50) is byte for byte the dist/ of c2fb637 (diff -rq). I drove both builds with Playwright at 1440 and 390, each served by vite preview on ports 4316 and 4317: Home, Reference, Drill, Signals, the Yard, Radio guided, Radio 'Call it yourself', and the Settings dialog. There were no console errors, no page errors and no sideways scroll, and all 18 states (text, controls, scroll, errors) are equal between the two builds.
- [learnerVisibleChanges] Yard, the same on both builds at both widths: job 0 loads at 'Moves 0 / par 5'. PULL 3 from AS73 with its switch normal is refused ('AS73 is lined normal — line its switch reverse for the track (CROR 104).'). After a click on the switch target of AS73, the same move passes ('Pulled 3 from AS73.', 'Moves 2 / par 5 · Joints 1').
- [learnerVisibleChanges] The brief asks for no change ('The job changes no screen, no word and no behaviour of the app'), and there is none.

## Wave 2a, Y1 step 2 (wf_bd2897c7-a27)

- [learnerVisibleChanges] The Yard chrome takes the Dusk palette and no longer sets its own ground, so the app floor shows. The edges of controls are gold (--cb-edge) and the edges of containers are gold rules (--lit-rule).
- [learnerVisibleChanges] Work it, Watch optimal, Depart and Certify have one gold lit look: a dim gold fill, a gold ring and gold text. Before, the buttons were blue, teal and green.
- [learnerVisibleChanges] A refusal is red text on a red wash with a red ring. A win is green text on a green wash with a green ring. 'Look it up' is gold text with a gold edge.
- [learnerVisibleChanges] The work order is a Dusk panel with a teal edge. The hint is now --ink-2 (10.89 or more; before, 3.82). The track name of a flagged switch-list line is the main ink.
- [learnerVisibleChanges] Bigger text, the dyslexia type and high contrast now reach the Yard text. code in the help takes the Dusk mono stack.
- [learnerVisibleChanges] No word, control, id, number, sound, stored value, box or canvas pixel changed.

## Wave 2b, B1 (wf_037e4dd7-b02)

- [changelog] The app is one Dusk window that fills the browser. The 920 px column is gone, and lines of reading text stay capped at the measure.
- [changelog] The title bar uses Dusk parts: a lamp in the home mark, the name, the tag line and a Dusk Settings button. The skip link has an opaque ground.
- [changelog] Home uses Dusk parts: a panel for the lede and the path, named rules for the headings, a teal tile for each live domain and a grey tile with the words "Coming soon" for a domain that is not live, Dusk rows for the stations with each emoji in an icon square, and a Dusk button for the tip link.
- [changelog] Settings uses the dialog part, a Dusk panel head, the toggle part for the five settings and the attention part for Reset.
- [changelog] Each control of the shell, Home and Settings is 44 by 44 px or more.
- [changelog] Each toggle in Settings shows a focus ring, and its state shows with forced colours.
- [changelog] Each checkbox in Settings is tied to its second line, and "Reset my progress" is plain text.
- [changelog] A screen reader no longer reads the icons in the controls of the shell and Home as part of their names.
- [changelog] The manifest has PNG icons at 192 and 512 px, and index.html links a 180 px icon for the home screen of Safari.
- [changelog] The label "Free · tip jar only" is 12 px, the Dusk size of a label. Each other text of the shell, Home and Settings keeps its size.
- [learnerVisibleChanges] The app is one dark Dusk window that fills the browser at every width, in place of the 920 px column. Reading text stays capped at 78 characters.
- [learnerVisibleChanges] Title bar: a green lamp in a 44 px square (the Home button), the name, the tag line in dimmer grey, a gold Settings button, and a gold thread under the bar. It is 56 px high at 1440, where it was 80.
- [learnerVisibleChanges] Home: a gold-edged lede panel with a gold upper-case chip, whose label grows from 11.52 to 12 px. The headings are named rules. The path panel shows its figure in mono over a teal bar with a gold edge.
- [learnerVisibleChanges] Domain cards become teal tiles with a cap and an empty icon square, a 6 px corner and a teal glow. A domain that is not live is a grey tile with a 'COMING SOON' tag and no fade.
- [learnerVisibleChanges] Stations become rows with no edge, with the emoji moved into a 12 px icon square. Exam is no longer faded: its name is dimmer and the words 'Coming soon' carry the state.
- [learnerVisibleChanges] The tip link becomes a 44 px gold Dusk button. The footer text is capped at the measure.
- [learnerVisibleChanges] Settings: a dark dialog with a lit edge, a gold Done button, a sample well with a gold 'Aa', square toggles with the knob at the right in gold when on, a red Reset button, and a dim note. The dialog is 352 px wide at 390, where it was 358.8.
- [learnerVisibleChanges] The skip link is an opaque 44 px Dusk link at the top left.
- [learnerVisibleChanges] For screen readers: the emoji are no longer read in control names (U-41), and each toggle reads its second line as a description (P-13).
- [learnerVisibleChanges] Home-screen icons: a 192 px and a 512 px PNG in the manifest, and a 180 px apple-touch-icon.
- [learnerVisibleChanges] With forced colours, the home mark, the dialog, the panels, the tiles, the station rows and the Dusk buttons lose their 1 px edges (open for the lead).

## Wave 2b, B2 (wf_e05c7a70-3df)

- [changelog] Reference, the Drill and Signals now use the Dusk look: framed panels with a lit edge, a sunk frame around each signal drawing, the Dusk row list for Reference, and a teal tile at the end of a session. Each word, button and step works as before, and no reading text is smaller.
- [changelog] Reference: the result list is now a real list of buttons for a screen reader. With no match, the words "No match. Try another word." stand in the place of the list (P-12).
- [changelog] Reference: a screen reader now says "Read aloud" for the read-aloud button, with no icon name in front (U-41).
- [changelog] Reference: the "Show the rule text" control is now 44 px high or more, so it is easier to press (P-05).
- [changelog] Reference: the book icon of the title now sits in the Dusk icon square (P-15).
- [changelog] Drill and Signals: a right answer and a wrong answer now show a mark and a lit edge as well as a colour, and the other answers show the disabled look with no fading. The words "Right." and "Not quite." stay.
- [changelog] Reference, the Drill and Signals: long lines of reading text now stop at a comfortable width on a wide screen. In the dyslexia mode, buttons and the end-of-session text also take the wider spacing and line height of the mode.
- [learnerVisibleChanges] Reference, the Drill and Signals wear Dusk: framed panels with a gold edge, sunk frames around the signal drawings, a teal tile at the end of a session, and a mono count chip and score.
- [learnerVisibleChanges] Reference rows are plain list rows with no card border. The search field is 44 px high instead of 50, and rows are lower: 47 to 107 px instead of 72 to 120.
- [learnerVisibleChanges] The trust badge is a chip with a 4 px corner instead of a pill, at 12 px instead of 11.52; a caution chip has a dashed edge.
- [learnerVisibleChanges] The 'Show the rule text' control is 44 px high instead of 24 (P-05).
- [learnerVisibleChanges] The station icon of the Reference title sits in a small square (P-15).
- [learnerVisibleChanges] Answer options are 50 px high instead of 52. After an answer, the other options show on the well with no fade. A right answer shows ✔ and a wrong one ✕ (CSS marks).
- [learnerVisibleChanges] The end actions are a row of buttons that each keep the width of their words, instead of full-width rows.
- [learnerVisibleChanges] For a screen reader: each Reference row is a button in a list item, and 'No match' is no longer inside the list (P-12). The Read aloud button is named 'Read aloud' without the emoji (U-41).

## Wave 2b, B3 (wf_3c924e01-982)

- [changelog] The Radio station takes the Dusk look: the mode tabs, "Call it yourself" and the guided walkthrough. Each word, control and step of today stays.
- [changelog] The guided Radio now follows "Bigger text", the dyslexia type and "Higher contrast", the text in the scene included.
- [changelog] "Key the radio" and "Run it again" are 44 by 44 px or more.
- [changelog] The rails in the Radio scene are easier to see (5.39:1 against the stage, 1.46:1 before).
- [changelog] The comments that called the Radio island a byte-for-byte copy are corrected, and a code comment no longer holds a name.
- [learnerVisibleChanges] The Radio has the Dusk look: lit panels, a gold selected tab, Dusk buttons, a readout strip, a framed question panel and a teal end tile.
- [learnerVisibleChanges] The guided Radio follows "Bigger text", the dyslexia type and "Higher contrast", scene text included (P-06).
- [learnerVisibleChanges] "Key the radio ▶" and "Run it again" are 44 px high (P-05).
- [learnerVisibleChanges] The rails of the scene are stronger (1.46:1 to 5.39:1).
- [learnerVisibleChanges] The end actions are buttons in a row, not full-width options.
- [learnerVisibleChanges] Blocks of reading text are capped at the measure.

## Wave 2b, Y2 (wf_849484e5-2b6)

- [changelog] The Yard picture is now look C2: one SVG with its words on plates, a wide form and a tall form, and a legend, in the colours of the Yard block of the bridge. The canvas and render.js are gone. (D-0031, D-0032, Y2)
- [changelog] The form and the frame of a job are chosen at the start of the job and kept for the job. A state that the wide form cannot draw turns the job to the tall form one time. (FORM-CHANGE, D-0038)
- [changelog] A move runs in for 840 ms and out for 420 ms (was 600 and 600), from --yard-run-in and --yard-run-out. With Reduce motion on, each time is 6 times as long, as before. (R7-P4)
- [changelog] A still line with an arrow shows the last move: toward the lead for a pull, into the track for a spot or a kick. A throw, a secure, a new job or the next move takes it away. (R7-P15)
- [changelog] Each switch has a box of 44 px. A press anywhere in the box lines the switch. (SWITCH-BUTTONS a)
- [changelog] Each word of the picture is 12 px or larger at each width. (TEXT-FLOOR)
- [changelog] Before a print, the picture lays out for the width of the page, so each track shows its end.
- [learnerVisibleChanges] The Yard drawing is now look C2: rails, ties and ballast, car shapes per type, plates with words, the room bars, break marks and a legend. It has a wide form and a tall form, chosen at the start of each job.
- [learnerVisibleChanges] New words of C2: NORMAL or REVERSE at each switch, ENGINE, BUILD k / m, 'foul point', the break mark, and the legend.
- [learnerVisibleChanges] After a pull, a spot or a kick a still trace shows the last move.
- [learnerVisibleChanges] Travel legs take 840 ms in and 420 ms out, in place of 600 and 600; the stretch, the arrival and the departure keep their times.
- [learnerVisibleChanges] A switch lines on a press inside a 44 px box around its stand.

## Wave 2b, Y3 (wf_4635545c-956)

- [changelog] Yard: the controls and panels around the yard drawing now use the Dusk look. The job picker and the readout sit in a lit strip. The work order is a panel with a head bar. The drawing, the move controls, the rules and the note sit in lit panels. Each rule chip is a tile in the colour of its kind. No word, number or control changed.
- [changelog] Yard: each control is 44 by 44 px or more (P-05): the job picker, the three selects of the move builder, the buttons, the lines of a switch list, 'Look it up →' and 'How to play'.
- [changelog] Yard: the job picker no longer pushes the page sideways on a 320 px screen or with wide text spacing (P-11).
- [changelog] Yard: Bigger text, the dyslexia type and higher contrast reach each part of the Yard chrome (P-06).
- [changelog] Yard: better contrast (P-07). The work-order hint is no longer a dim italic, and the edges of the selects can be seen.
- [changelog] Yard: with SECURE, the car count shows a disabled look with text that is easy to read, in place of a dimmed control.
- [changelog] Yard: a refusal shows a ✕ mark and ink text. Red is on the edge and the mark only.
- [learnerVisibleChanges] The Yard chrome now uses Dusk parts:
- a lit strip for the picker and the readout;
- a framed work order with a head bar;
- a lit frame around the drawing;
- a panel for the move builder;
- a rules panel with tiles capped in colour;
- a panel for the note;
- a gold help summary.
- [learnerVisibleChanges] Each Yard control is 44 by 44 px or more (P-05). The job picker no longer pushes the page sideways at 320 px (P-11).
- [learnerVisibleChanges] The message text is ink. A refusal shows a ✕ mark and a red edge; a win shows a green edge.
- [learnerVisibleChanges] The tip text is no longer italic, and the disabled count select is no longer dimmed.
- [learnerVisibleChanges] The work-order head labels grew from 11 px to 12 or 13 px.
- [learnerVisibleChanges] The Yard page is about 214 px taller at 1440 (1234 to 1448 px).

## Wave 2b, B-COL (wf_9cc0b584-d1e)

- [changelog] Reference, the Drill, Signals and both Radio modes now sit in a column of at most 920 px in the middle of the window. Home, Settings and the Yard still fill the window. On a phone the column takes the full width, as before. (SURFACE-COLUMN)
- [changelog] In the Radio, each boxed text now spans the full width of its column or panel, so its edges line up with the scene and the panels: the scenario, the transcript lines, the call box, the done box, the tip, the incoming call and the engineer's acknowledgement. The quote of the rule text in a Reference entry now spans the width of its panel. Lines of plain text keep their reading width. (SURFACE-COLUMN)
- [changelog] The domain tiles on Home no longer show an empty dark square in their coloured top bar. The bar shows the domain name only, in line with the text below it. (TILE-CAP-SQUARE)

## Wave 2c, U1-A (wf_6438abec-fdb)

- [changelog] The Signals drill asks no question with a drawing that two signal items share. The drill does not choose between the two names (U-01).
- [changelog] The Drill selection is a set of pure functions in src/core/drill.ts, with the random source as a parameter. The move changed no behaviour (U-44).
- [changelog] A signal entry and the Drill use each different drawing one time. The entry button reads 'Open the Signals drill →' (U-37).
- [changelog] The Drill and Signals show a station heading. The question heading and the end heading are h3 headings (U-29).
- [changelog] After an answer, the right option shows 'Correct answer' and a picked wrong option shows 'Your answer'. A miss names the right answer (U-06).
- [changelog] In the Drill feedback, 'Next' is the main control and 'Look it up' is a text link (U-38).
- [changelog] After 'Next', keyboard focus goes to the heading of the next question (U-14).
- [changelog] A screen reader hears the Drill verdict. A miss on a safety-critical item is an alert (U-19).
- [changelog] With Read aloud on, the Drill also speaks the options, the feedback and the question text of a signal question (U-31).
- [changelog] The Drill reads the mastery after the decay. The review button gives the count of items and the count of questions (U-15).
- [changelog] The end of a Drill session gives progress in words. A session with no due item says that it is practice only (U-26).
- [changelog] The end of a Drill session names the way back '← Home' (U-40).
- [changelog] Reference labels the four steps with the source SME '● No CROR citation in the verified source' (U-08).
- [changelog] Each Reference row shows its domain and its trust mark as words (U-02, U-32).
- [changelog] A pressed Reference row opens its entry under the row, and focus moves to the entry (U-03).
- [changelog] Reference promises only what the app holds. An entry says when it has no rule text or no text (U-11).
- [changelog] The Reference search also reads the source, the rule text and the domain. The list has one group for each kind of entry (U-32).
- [learnerVisibleChanges] Drill and Signals:
- [learnerVisibleChanges] A station heading at the top.
- [learnerVisibleChanges] An answered option carries 'Correct answer' or 'Your answer'.
- [learnerVisibleChanges] A miss names the right answer.
- [learnerVisibleChanges] 'Next →' is a full-width button and 'Look it up →' is a text link.
- [learnerVisibleChanges] Focus goes to the new question after 'Next'.
- [learnerVisibleChanges] A screen reader gets the verdict from a live region, and a miss on a safety item comes as an alert.
- [learnerVisibleChanges] Read aloud also speaks the options and the feedback.
- [learnerVisibleChanges] The end of a session gives progress in words, and a session with no item due carries a practice-only note.
- [learnerVisibleChanges] The review button counts its items and its questions.
- [learnerVisibleChanges] The end button reads '← Home'.
- [learnerVisibleChanges] The change line counts only the answers of the session.
- [learnerVisibleChanges] A drawing that belongs to two signal items is never asked, and each different drawing of an item is drawn with equal weight.
- [learnerVisibleChanges] Reference:
- [learnerVisibleChanges] A new lede.
- [learnerVisibleChanges] The list is in four groups, and each row shows its domain and its trust mark in words.
- [learnerVisibleChanges] A pressed row opens its entry under the row and moves focus to it.
- [learnerVisibleChanges] The search reads the source, the rule text and the domain name.
- [learnerVisibleChanges] Four SME-source radio steps read '● No CROR citation in the verified source'.
- [learnerVisibleChanges] Entries say when the rule text or all text is not in the app.
- [learnerVisibleChanges] Each different drawing shows one time.
- [learnerVisibleChanges] The signal button reads 'Open the Signals drill →'.

## Wave 2c, U1-B (wf_12310190-171)

- [changelog] On load, the app repairs a damaged stored profile. Each readable item stays, and the app first keeps the stored text under a second key. When a screen cannot draw, the app offers "Save a copy of the stored data" and "Start fresh". (U-05)
- [changelog] Settings can save the progress to a file and load it again. One sentence says that a browser clean-up deletes the progress. (U-18)
- [changelog] "Look it up" can open the Reference entry in a dialog on top of the station, through lookUp in the app context and in the island bridge. A later job switches the callers. (U-17)
- [changelog] When a content file does not load, the shell shows one notice, "Part of the library did not load.", with "Try again". Home shows no false "Coming soon". When a station island does not load, the station says so and offers "Reload". (U-07)
- [changelog] A new version waits until the learner presses "Reload" in the notice "A new version is ready." The page never reloads by itself. (U-10)
- [changelog] "Reduce motion" follows the device setting live. "Higher contrast" starts from the device setting. Settings says why a row is on. (U-13)
- [changelog] The stage name agrees with "N% mastered" at 85 %. (U-15)
- [changelog] Each route has its own page title. After a change of station, focus goes to the station heading. (U-29)
- [changelog] The dyslexia mode ships Atkinson Hyperlegible, with its SIL Open Font License 1.1 text beside the font files. (U-30)
- [changelog] Read aloud speaks its confirmation, says "No voice on this device" when that is true, and stops on a change of route. (U-31)
- [changelog] Two open copies of the app keep the answers of both. (U-34)
- [changelog] Home: new lede words, "Practice, not the official test.", one main control ("Start here", or "Continue" with "N due now"), domain tiles with "N%" and "Drill →", no Exam row, and a tip link that says it opens a new tab and does not send the page address. The owner approves these words. (U-11, U-24, U-25, U-26, U-27, U-33, U-35, U-42)
- [changelog] "Reset my progress" also removes the stored Yard sound choice. (U-36)
- [changelog] Shared parts: the option edge, one forced-colours block, the disabled select at full opacity, and a dialog head that stays in view. The dead rules of src/index.css are gone. (lead rulings)
- [changelog] The shell calls unmount() of a station island before it empties the host. (2c-plan C2)
- [learnerVisibleChanges] U-05: a screen for a render error ('Clear Board could not show this screen', 'Save a copy of the stored data', 'Start fresh', and a question before Start fresh).
- [learnerVisibleChanges] U-07: the shell notice 'Part of the library did not load.' with 'Try again'; no 'Coming soon' on any tile while a file has failed; 'This station did not load.' with 'Reload' in the host of an island.
- [learnerVisibleChanges] U-10: the shell notice 'A new version is ready.' with 'Reload'. The page no longer updates by itself.
- [learnerVisibleChanges] U-11 and U-25: the new lede; 'Practice, not the official test.' on Home, in the meta description and in the manifest description.
- [learnerVisibleChanges] U-13: 'Reduce motion' follows the device and is held on with the line 'Your device asks for less motion, so this stays on.'. 'Higher contrast' starts from the device, with the line 'Your device asks for more contrast.'.
- [learnerVisibleChanges] U-15: the stage name agrees with 'N% mastered' at the edges (85, 50, 15).
- [learnerVisibleChanges] U-17: the look-up dialog. It has no caller in 2c-1.
- [learnerVisibleChanges] U-18: the Settings rows 'Save my progress' and 'Load my progress', their question and result lines, and the sentence about a browser clean-up.
- [learnerVisibleChanges] U-24, U-27, U-26, U-33: 'Start here' or 'Continue' with 'N due now' or 'Nothing due now'; 'N%' and 'Drill →' on each live tile; the Radio tile pointer line; the new subtitles of The Yard and Radio walkthrough.
- [learnerVisibleChanges] U-29: a page title for each route; focus on the view heading after a route change; no ring round the whole view at load (this changes the pixels of every page in the look compare).
- [learnerVisibleChanges] U-30: the dyslexia mode draws Atkinson Hyperlegible from files that ship with the app.
- [learnerVisibleChanges] U-31: the spoken confirmation of Read aloud; 'No voice on this device.'; speech stops on a route change.
- [learnerVisibleChanges] U-34: answers from two open copies are kept.
- [learnerVisibleChanges] U-35: no Exam row on Home.
- [learnerVisibleChanges] U-36: Reset also clears the Yard sound choice.
- [learnerVisibleChanges] U-42: '(opens a new tab)' on the tip link, and no referrer is sent.
- [learnerVisibleChanges] OPTION-EDGE: the edge of the answer options is brighter (3:1 or more). FORCED-COLOURS: a 1 px border on six parts in forced colours. Not in a row: the head of a dialog stays at the top while the dialog scrolls (bc1bbdf).

## Wave 2c, U1-C (wf_5fe37a65-28f)

- [changelog] The Radio shows one station heading, "Radio walkthrough", in both modes, and "← Home" is the first control in both modes.
- [changelog] The guided Radio shows the distance or the status as page text above the next call, with the same words as the drawing.
- [changelog] The guided Radio works with a keyboard and a screen reader: the log is a Tab stop and announces each new line, the mode tabs move with the arrow keys, and the focus stays on "Key the radio" after each call.
- [changelog] A change of Radio mode keeps the place in each mode.
- [changelog] In "Call it yourself", a screen reader hears "Right." or "Not quite." after an answer, and Read aloud also reads the options and the feedback.
- [changelog] In "Call it yourself", the source line says "No CROR citation in the verified source" in place of the code "SME". The end of a session says "Session done", says "did not move" when the shown change is 0, and offers "← Home" in place of "Back to the path".
- [changelog] The guided Radio no longer promises a "next layer".
- [changelog] The option logic of "Call it yourself" moved to src/core/radio.ts, so a test can give it a fixed random source. The behaviour does not change.
- [learnerVisibleChanges] Both Radio modes show '← Home' first, then the heading '📻 Radio walkthrough' above the mode tabs.
- [learnerVisibleChanges] The guided Radio repeats the distance or the status as a bold line above 'YOUR NEXT CALL', with the words of the scene.
- [learnerVisibleChanges] The guided Radio end box loses 'The move/departure is the next layer.'
- [learnerVisibleChanges] In the guided Radio, the focus stays on 'Key the radio' after each press, and moves to 'Run it again' after the last call.
- [learnerVisibleChanges] The mode tabs work with the arrow keys, Home and End. The log is a Tab stop and scrolls with keys.
- [learnerVisibleChanges] A change of mode keeps the guided walkthrough and the test where they were.
- [learnerVisibleChanges] In the Radio test, the source line of calls 6, 8, 9 and 10 says 'No CROR citation in the verified source' in place of 'SME'.
- [learnerVisibleChanges] At the end of a session: 'Session done' (was 'Run done'), and '← Home' (was 'Back to the path').
- [learnerVisibleChanges] At the end of a session, 'did not move' in place of 'moved' when the shown change is +0%.
- [learnerVisibleChanges] With Read aloud on, the Radio test also speaks the question, the options and the feedback.
- [learnerVisibleChanges] My repair: after 'Next call →', 'Finish', 'Run it again' or 'Practice…', the keyboard focus goes to the heading of the call or to the end heading, with a ring when the keyboard is used.

## Wave 2c, Y4a (wf_11e02a53-1b1)

- [changelog] Yard: one native button for each switch, AS71 to AS76, on its 44 px box in the wide and the tall form. Tab, Enter and Space line a switch, and the name says the track and the lining (P-02).
- [changelog] Yard: a text list of the yard for a screen reader, and one status region that says the result of each move and each refusal of the model as it is (P-03).
- [changelog] Yard: "Reduce motion" ends each move, kick, arrival, departure and watched step at once, with the end state, its words and the trace. The setting is read at each move. Before, it made each move about six times slower (P-01).
- [changelog] Yard: Tab reaches each line of a switch list, and Space flags it (U-09).
- [changelog] Yard: the job, action and track selects have visible labels, "cars" labels the car count, and the sound button says "Sound on" or "Sound off" (U-20).
- [changelog] Yard: "Watch optimal" can be stopped with "Stop watching", and the Yard asks before Watch optimal or a change of job discards your moves (U-12).
- [changelog] Yard: the message well and the note take the full width while their text stays at the reading measure; only car marks and numbers of the job line use the mono face (Y-FIX).
- [changelog] Yard: one heading, "The Yard", under "← Home" (U-29).
- [changelog] Yard: the Yard draws and plays when the browser refuses storage (U-07).
- [changelog] Yard: the controller exports unmount(), which stops each timer, animation frame, loop and listener of the Yard when the learner leaves (UNMOUNT).
- [learnerVisibleChanges] A heading '🚂 The Yard' under '← Home'. The way back is now drawn by the station wrapper; its look is as before.
- [learnerVisibleChanges] Visible labels 'Pick a job', 'Action' and 'Which track' above three selects. The word 'cars' is now the label of the count select.
- [learnerVisibleChanges] The sound button reads '🔇 Sound off' or '🔊 Sound on'.
- [learnerVisibleChanges] Six switch buttons on the switch boxes: a hover wash, a focus ring, and the switch throws by Enter, Space or a tap.
- [learnerVisibleChanges] The switch-list lines are buttons, so Tab reaches them and Enter or Space flags them.
- [learnerVisibleChanges] While the line plays, 'Watch optimal' reads 'Stop watching' and stops the line.
- [learnerVisibleChanges] A question with Yes and No before Watch optimal or a job change discards the learner's moves.
- [learnerVisibleChanges] With Reduce motion on, each move, kick, arrival, departure and watched step ends at once, with the end state and the trace. Before, it was 6 times slower.
- [learnerVisibleChanges] The message well and the note take the full width; their text stays at the measure.
- [learnerVisibleChanges] In the job line, the track id and the words 'don't match' and 'Depart ▸' are in the text face; the car numbers stay mono.
- [learnerVisibleChanges] The Yard loads when the browser refuses storage.
- [learnerVisibleChanges] For a screen reader only: the text mirror #yard-mirror and the status region #yard-live.

## Wave 2c, G1-2 (wf_90399f2f-adf)

- [changelog] The gate `npm run check` has 12 steps. Step 12 lists each signal drawing that belongs to two signal items or more (row U-01). It is a report and does not fail on a shared drawing. Today it lists two drawings.
- [changelog] New unit tests (row U-44) cover the Drill selection and the guard of the grading in src/core/drill.ts, the options of the Radio test in src/core/radio.ts, and the frozen signal drawing function. The unit tests now number 79.
- [changelog] The browser smoke test has 19 gate cases. An open app that gets a new version shows "A new version is ready." and reloads only when the learner presses "Reload" (P-22, row U-10). When a content file does not load, the notice shows, Home shows no "Coming soon", and "Try again" loads the file (P-22, row U-07). With storage refused by the browser, the six routes draw (P-22, row U-07). The offline cache of the build stays at 5 MB or less (row U-43).
- [changelog] A report case of the smoke test counts the routes where focus does not go to the first heading of the view after a change of route (2c-plan C7). Today it counts the Drill and Signals.
- [changelog] The browser gates press the control of each learn card of the Drill before the first question (2c-plan C11).
- [changelog] The word tape of the guided Radio is recorded again from the build of 7f10e7b (rows U-21 and U-35).
- [changelog] The look harness names the row of each allowed change. A select is named by its label. Visually hidden text is not page text. The text mirror of the Yard has its own check. A new shot shows the first screen of the Drill.
- [changelog] The package is named clear-board, with the version 2.0.0.

## Wave 2c, U1-D (wf_70111625-ce1)

- [changelog] Changed: "Look it up" in the Drill, Signals and "Call it yourself" opens the entry in a dialog on top of the station. The session, the answer and the scroll stay, and closing the dialog returns focus to "Look it up" (U-17).
- [changelog] Changed: when a content file does not load, the Drill, Signals, Reference and "Call it yourself" show "Part of the library did not load." with "Try again" in place of a sentence that was not true. "Call it yourself" says "This station did not load." with "Reload" when its module does not load (U-07).
- [changelog] Added: the Drill and Signals show a new item on a learn card (its title, the chip "New item", its plain words, each different drawing, and "Next →") before the first question about it. One other screen comes between the card and that question, and the mastery model does not change (U-28).
- [changelog] Changed: after an answer in "Call it yourself", the right option says "Correct answer" and a picked wrong option says "Your answer". After a miss the feedback names the right call (U-06).
- [changelog] Fixed: "Call it yourself" reads the start and end values of a run after the decay, so a direct load no longer shows the decay as a loss (U-15).
- [changelog] Fixed: Home shows the current mastery after a change of route (MASTERY-NOW).
- [changelog] Fixed: the end note "This session was practice only" shows only when no answer of the session counted (U-26).
- [changelog] Fixed: after a change of route to the Drill or Signals, focus stays on the station heading (C7).
- [changelog] Fixed: the spoken name of a domain tile on Home holds its number one time (TILE-BAR).
- [changelog] Changed: "Reset my progress" also removes the stored copy of an older profile (RESET-COPY).
- [changelog] Changed: Reference and the look-up dialog show one entry component. The dialog now shows the notes of U-11 and each different drawing one time (ENTRY-ONE).
- [changelog] Changed: the app runs the tested grading guards of src/core/drill.ts. Behaviour does not change (U-44).
- [changelog] Removed: five names of the bridge that no rule read: --surface, --clear, --caution, --stop and --r (BRIDGE-DEAD).
- [changelog] Changed: a comment of src/core/severity.ts names the SME and no person (P-25).
- [learnerVisibleChanges] Drill and Signals: a learn card shows before the first question about an item that the learner never answered (row 8, words 'New item' and 'Next →'). 'Question N of M' counts questions only.
- [learnerVisibleChanges] 'Look it up →' in the Drill, Signals and 'Call it yourself' opens the entry in a dialog on top of the station. The session, the answer state and the scroll stay (row 1).
- [learnerVisibleChanges] After a failed load, the Drill, Signals, Reference and 'Call it yourself' show 'Part of the library did not load.' with 'Try again' in place of a false sentence. When its module did not load, 'Call it yourself' shows 'This station did not load.' with 'Reload' (row 2).
- [learnerVisibleChanges] Focus goes to the station heading after a change of route to the Drill or Signals (row 4).
- [learnerVisibleChanges] 'Call it yourself': the right option shows 'Correct answer' and the picked option 'Your answer'. A miss shows 'Correct answer: <call>', and the region and Read aloud say it too (row 6).
- [learnerVisibleChanges] 'Call it yourself': the end line after a direct load reads the value after the decay, for example '+0% … did not move' in place of '-45% … moved' (row 7).
- [learnerVisibleChanges] Home shows the current mastery after a change of route (row 10).
- [learnerVisibleChanges] The end note 'This session was practice only' shows only when no answer of the session counted (row 11).
- [learnerVisibleChanges] A screen reader says the number of a domain tile one time (row 12).
- [learnerVisibleChanges] 'Reset my progress' also removes the copy of an older profile (row 13).
- [learnerVisibleChanges] Look-up dialog: each different drawing shows one time, and the two U-11 notes show (row 14).

## Wave 2c, Y4b (wf_957d02c2-479)

- [changelog] **Watch the optimal line one step at a time.** Back, Next, Play all and Stop, with a list of the steps. A watched line gives no done mark and no win sound; old done marks stay. (R7-P8, U-04)
- [changelog] **Nothing locks during a move.** A new press ends the running move at its end state and then acts. The result is said when the move starts. (R7-P11)
- [changelog] **After Depart the train is gone.** The lead shows empty, and the job stays closed until Reset. (R7-P14)
- [changelog] **The arrival plays only when you ask** ("▶ Show the arrival"), with "Wait for the train." while it plays. (R7-P5, U-39)
- [changelog] **A move log:** each call with its result and its cost, plus "Before and after" and "Play again". Neither changes the game. (R7-P10)
- [changelog] **The cost of each call in words**, including the pull-out that the model charges late after a spot. The words wait for the SME. (R7-P12)
- [changelog] "Job done." starts each finish; the record reads "5 moves, 2 couplings"; the readout says Couplings. (U-23, U-40)
- [changelog] The head bar shows the route ("Route: LEAD → AS73") and the goal ("BUILD AS75 0 / 6"). The picture shows where a spot or a kick will land. (ROUTE-WORDS, YARD-HEAD, LANDING)
- [changelog] Sound is off by default and remembers your choice. A new confirm sound plays for secure, flag and certify. (R7-P2, U-36, R7-P9)
- [changelog] First job: a line says how to line a switch and how to call a move, and the builder starts on a track of the job. Also: a key for the picker marks, no empty banner box, and calmer words in the switch-list refusal. (U-16, U-39)
- [changelog] "Look it up" opens the rule on top of the Yard. A switch throw clears a refusal that is no longer true. (U-17, R7-P16)
- [changelog] Y4a review points: the switch buttons drop aria-pressed, leaving the Yard stops pending win notes, focus stays in the work order after Certify, and track ids use the mono face. (SW-NAME, SOUND-STOP, CERTIFY-FOCUS, TRACK-MONO)
- [learnerVisibleChanges] 'Look it up →' opens the entry in a dialog over the Yard. The job and the moves stay.
- [learnerVisibleChanges] The sound is off by default, has its own switch, and the choice holds. A reset of progress clears it.
- [learnerVisibleChanges] Secure, a flag and a right certify play a new confirm sound.
- [learnerVisibleChanges] 'Watch optimal' opens a stepper with Back, Next, Play all and Stop, and a panel of the line. A watched line gets no done mark and no win sound. The tooltip is new.
- [learnerVisibleChanges] Nothing locks during motion: a new press ends the running move at its end state. The result shows when the move starts.
- [learnerVisibleChanges] After Depart the lead is empty, and calls are refused until Reset.
- [learnerVisibleChanges] On p6-road the arrival runs only on '▶ Show the arrival'.
- [learnerVisibleChanges] A move log lists each call with its result and cost, with 'Play again' and 'Before and after'.
- [learnerVisibleChanges] Cost words follow each result.
- [learnerVisibleChanges] 'Job done.' starts each finish. The record reads 'N moves, M couplings', and the readout says 'Couplings'.
- [learnerVisibleChanges] A head bar of the picture shows the route words and BUILD k / m.
- [learnerVisibleChanges] Dashed landing outlines show where the move in the builder will land.
- [learnerVisibleChanges] The legs of a move take 840 ms in and 420 ms out.
- [learnerVisibleChanges] The first job has a how-to line, and the builder starts on a track of the job.
- [learnerVisibleChanges] A key line sits under the picker, and the banner hides when it is empty. A wait line shows during the arrival, and the list refusal is calmer.
- [learnerVisibleChanges] The switch buttons have no pressed state. Focus stays in the work order after Certify. Track ids in the job line are mono.

