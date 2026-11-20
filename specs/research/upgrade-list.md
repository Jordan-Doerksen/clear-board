# Upgrade list — the ranked table for Gate A, question 4

Wave 1, research. Read-only on code and content. Date: 2026-11-20.
Branch `claude/peaceful-mayer-qat99l`.

This file merges the checked findings of three reports in `specs/research/`:
`R4-learning-ux-audit.md` (UX-01 to UX-40), `R5-accessibility-audit.md` (A11Y-01 to A11Y-29) and
`R6-engineering-audit.md` (ENG-01 to ENG-23). The 92 findings give 51 rows for the owner.

## 1. How to read this file

The ranking rule, in three lines:

1. Value first: safety of learning (a learner is misled or blocked), then access (a learner is
   locked out), then trust and polish.
2. Cost second: effort and the risk of the change.
3. At equal value the cheaper and safer row is higher. A row with a recommended "no" is at the end.

The owner answers each row of section 2 with yes or no. Silence is not a yes.

- A row is a change of a behaviour, a word or a control. No reskin job may make such a change
  without a yes (fence item 3). That is why these rows are offered and not built.
- No row edits a frozen file. No row writes, corrects or cites a rule.
- Work that a planned job carries is in section 3. It needs no answer.
- Work that needs a frozen file, rule content from the SME, or a Windows build is in sections 4, 5
  and 6. It is not offered.
- Effort: S is less than half a day, M is one to two days, L is more. Effort and risk are the
  estimates of the reports. They are not measured.
- Job: the wave job of the plan (section 6 of `specs/clear-board-2-plan.md`) that would carry the
  row. "U1" is the job for approved upgrade rows. "(addition)" means more work for a planned job.
- "(words)" in a row: after a yes, the owner approves the new words. The lead asks one question for
  each such row.
- A "not verified" mark of a report is carried into the row.

Counts: 51 rows. Recommended: 46 yes, 5 no. Effort: 37 S, 1 S to M, 13 M, 0 L.

Method of this merge: each finding and each "Check:" line of the three reports was read. The audits
were not repeated. Sixteen cited code places, the workflow folder and one data count were opened
again; each agreed with the reports (`src/core/store.ts:44`; `src/stations/yardSim.js:228-229` and `:463-469`;
`src/stations/yard/anim.js:6` and `:17`; `src/stations/Drill.tsx:54-58`;
`src/stations/Reference.tsx:8-12` and `:55`; `vite.config.ts:15-17`;
`src/stations/imperativeStation.ts:34`; `src/index.css:93-94`; `src/stations/Home.tsx:26`, `:64`
and `:68`; `package.json:8` and `:12`; one workflow file; 100 of 100 rule items with no rule text).
No numbered finding of the three reports was withdrawn. The withdrawn statements (R4 section 10,
R5 section 19, R6 section 20) are not used here. No web source is used.

## 2. The table — yes or no for each row

| Rank | Id | The upgrade | Why | Source | Effort | Risk | Job | Recommended |
|---|---|---|---|---|---|---|---|---|
| 1 | U-01 | The Signals drill does not ask a question when its drawing belongs to two indications. A gate check lists each shared drawing and does not fail. | Today the drill can mark a correct name as wrong. This was seen on screen. 7 of 1385 signal questions offered the two names. | UX-01 | S | LOW. No data edit. | U1; G1 (the check) | yes: the worst class of failure, and a small fix |
| 2 | U-02 | Each row of the Reference list shows its trust mark as a word. | Four signal entries that are not yet verified show no mark in the list today. | UX-07 | S | LOW | U1 | yes: unverified content must not look verified |
| 3 | U-03 | A pressed Reference row opens its entry at that row, and focus moves to the entry. | Today the entry opens below 219 rows (19 419 px down at 1440 px wide). The screen does not change. | UX-03, A11Y-06 | S | LOW | U1 | yes: the look-up is the purpose of Reference |
| 4 | U-04 | A Yard job that the learner only watched gets no "done" mark. Marks in old profiles stay. | Today "Watch optimal" stores the job as complete. Old data cannot tell a watched job from a played job. | UX-06 | S | LOW | U1 | yes: the record must be true |
| 5 | U-05 | A damaged stored profile is repaired on load. If the app cannot draw, a screen offers "Save a copy of the stored data" and "Start fresh". | Today a profile with a missing field gives a blank app on each route, and Settings cannot be reached. An unreadable profile is replaced and no copy is kept. | UX-19, ENG-02, ENG-03 | S | LOW | U1 | yes: U-18 needs it first |
| 6 | U-06 | After an answer, the right option and the picked wrong option carry words, and the feedback names the right answer. | Today the two differ by colour only (1.32:1). In 8 of 27 wrong answers the feedback did not hold the right answer. | UX-14, A11Y-11 | S | LOW | U1 | yes: fence item 5 asks for words |
| 7 | U-07 | When content or a station does not load, the app says so and offers a retry. The Yard loads when the browser refuses storage. | Today the app shows "Coming soon", "No match" or a blank Yard. These statements are false. | UX-18, ENG-02, ENG-01 | M | LOW | U1 | yes: fence item 15 |
| 8 | U-08 | Reference takes the source label of an entry from its data. The Radio test shows plain words in place of "SME". | Four entries say "CN practice (GOI)" and their source in the data is "SME". | UX-38, UX-34 | S | LOW. It uses labels that the app has. | U1 | yes: a source label must be true |
| 9 | U-09 | The lines of a Yard switch list can be flagged with the keyboard. | A job with a switch list cannot start without a pointer today. | A11Y-02 | S | LOW | Y4 (addition) | yes: Y4 opens the rest of the Yard to the keyboard |
| 10 | U-10 | After a release, the open app shows "A new version is ready" with one control. It reloads only when the learner chooses. | Today an open app shows a blank Yard after a release that changes the Yard (4 of 4 runs). This change request changes the Yard. | ENG-01 | M | MEDIUM. It changes how the service worker is registered. The control was not built: not verified. | U1 | yes: the next release causes the fault |
| 11 | U-11 | Home and Reference promise only what the app holds. An entry with no rule text, or with no text, says so in app words. (words) | Two screens promise the rule text "one tap deeper". 100 of 100 rule entries have none. One empty entry shows "verified". | UX-09, UX-35 | S | LOW. No rule and no citation is written. | U1 | yes: fence item 15 |
| 12 | U-12 | "Watch optimal" can be stopped. The Yard asks before it discards the moves of the learner (Watch optimal, a change of job). | The demonstration runs 10 s and no control stops it. One key press on the job picker discards a job in progress. | A11Y-29, UX-06, A11Y-18, UX-31 | S | LOW | Y4 (addition) | yes: no loss of work without a question |
| 13 | U-13 | "Reduce motion" is on when the learner chose it or when the device asks for it, and it follows a change on the device. "Higher contrast" starts from the device. Settings gives the reason. | Today the app reads the device one time, at the first load. After that the stored value wins. The Dusk layers stop their motion on the device flag only. | A11Y-07, A11Y-27 | S | LOW | U1 | yes: the safe side, and it agrees with Dusk |
| 14 | U-14 | After "Next" and after "Key the radio", keyboard focus stays in the task. | Today focus goes to the top of the page: 6 Tab presses for each question, where 2 are necessary. | A11Y-09 | S | LOW. The Radio part edits `radioSim.js` outside `STEPS`. | U1 | yes |
| 15 | U-15 | Four small errors in progress text are corrected: the change after a direct load, "moved" at +0 %, the count in "Practice the N you missed", the stage name at exactly 85 %. | Each one tells the learner something untrue about progress. Example: 6 of 6 correct answers showed "-11%". | UX-39, UX-27, ENG-20 | S | LOW | U1 | yes |
| 16 | U-16 | The first Yard job says, in view, how to line a switch and how to call a move. The move builder starts on a track of the job. | The first necessary action is explained only in a closed section below the first screen. The first refusal names a rule and not the control. | UX-13 | S | LOW. The refusal text in the frozen file stays. | U1, after Y4 | yes |
| 17 | U-17 | "Look it up" opens the entry on top of the station. The session, the Yard job and the Radio run stay. A change of Radio mode keeps the run. | Today "Look it up" ends the session or the job. Back returns to question 1 of 10, or to 0 moves. | UX-04 | M | MEDIUM | U1 | yes: a help link must not cost the work |
| 18 | U-18 | Settings can save the progress to a file and load it again. One sentence says that a browser clean-up deletes the progress. | Lost progress has no recovery today. `SPEC.md` promises export and import. | UX-05, ENG-03 | M | MEDIUM. The file stays on the device. U-05 comes first. | U1 | yes |
| 19 | U-19 | A screen reader hears the verdict after an answer in the Drill and in the Radio test. A miss on a safety item is announced at once. | Today the message region is created with its text, so the message can be missed. What a screen reader says: not verified. | A11Y-10, UX-20 | S | LOW | U1 | yes |
| 20 | U-20 | The four Yard selects have visible labels. The sound button has a text name and a state. | Today each name comes from a tooltip, and the name of the sound button is an emoji. | A11Y-18, UX-33 | S | LOW | Y4 (addition) | yes |
| 21 | U-21 | The guided Radio repeats the distance and the status as page text above the call. | At phone width the scene text is 4 to 6 px high, and the distance is given only there. | UX-23, A11Y-16 | S | LOW. It edits `radioSim.js` outside `STEPS`. Each word stays. | U1 | yes |
| 22 | U-22 | The guided Radio gets a correct structure for keyboard and screen reader: a log that scrolls with keys and is announced, a heading, a named scene, a correct mode switch, "← Home" first. | The automated scan finds three failing rules here. The log cannot be scrolled back with keys. | A11Y-19, UX-32, UX-29 | S | LOW. Outside `STEPS`. What a screen reader says: not verified. | U1 | yes |
| 23 | U-23 | Each Yard finish starts with "Job done." The record reads "5 moves, 2 couplings", and the readout says "couplings". | A finish above par does not say that the job is done. "5m/2j" is not explained. | UX-15 | S | LOW. The banner text in the frozen file stays. | U1 | yes |
| 24 | U-24 | The Radio card on Home points to the scored mode "Call it yourself", and the station card names that mode. (words) | From the Radio card the Radio bar cannot pass 38 %. The other 8 items are graded only in a mode that the card does not name. | UX-37 | S | LOW | U1 | yes |
| 25 | U-25 | The words "job-ready" change, and one plain line says: practice, not the official test. (words) | "Job-ready" is close to the claim that decision D-0013 defers. `SPEC.md` asks for the "not the official test" label, and the app has none. | UX-24 | S | LOW | U1 | yes |
| 26 | U-26 | Progress is also given in words: answers right, items started, when items come back, "N due now" on Home, and a note when a round is practice only. | After a first session each bar reads "+0% → 0%". The numbers are true, and they read as "nothing happened". | UX-12 | M | LOW. The model and the numbers stay. | U1 | yes |
| 27 | U-27 | Home has one main control: "Start here" for a new learner, "Continue" with the count of items due for the others. (words) | Home gives 12 cards of equal weight and no first step. | UX-10 | M | LOW | U1 | yes |
| 28 | U-28 | The Drill shows an item one time before it tests that item for the first time. | Today the first question is a cold test. The design record asks for no cold draw. | UX-11 | M | MEDIUM. The mastery model stays. The step shows text that the data holds. | U1 | yes |
| 29 | U-29 | Each station has its own page title and a heading. After a change of station, focus goes to that heading. At the first load focus does not move. | The title is the same on each route, the Yard has no heading, and a ring frames the whole view after a load. | A11Y-22, A11Y-23, UX-32 | S | LOW. The ring on a real device: not verified. | U1 | yes |
| 30 | U-30 | The dyslexia setting gives the same face on each device: the app ships the face as a font file. With a "no", the label changes to what the setting does. | The app names a face and ships no font file, so the face depends on the device. | A11Y-20, UX-16, ENG-07 | S | LOW. The licence and the file size: not verified. Dusk decision D-011 says "no font file" for Dusk. | U1 | yes, if the licence allows it |
| 31 | U-31 | Read aloud also reads the options and the feedback, speaks its confirmation, says "No voice on this device" when that is true, and stops on a change of station. | It reads the question only, and it does not read a signal question. A device with no voice gets no notice. | A11Y-25, UX-26 | M | LOW | U1 | yes |
| 32 | U-32 | The Reference search also reads the source line, the rule text and the domain name. The list has groups, and each row shows its domain. | "CROR 112" finds 0 rows, and each entry shows that text as its source. 97 of 100 rule titles are a number only. | UX-21 | M | LOW | U1 | yes |
| 33 | U-33 | Each domain card on Home says what a press does and shows its mastery as a number. Two station subtitles use plain words. (words) | The visible card text has no verb, the bar has no number, and "Work the cuts" is not a first-day word. | UX-10, A11Y-24, UX-22 | S | LOW | U1 | yes |
| 34 | U-34 | Two open copies of the app keep the answers of the two copies. | Today the later save removes the answers of the other copy (2 of 2 runs). | ENG-21 | S to M | MEDIUM. It changes how the profile is written. The fix was not built: not verified. | U1, after the store tests of G1 | yes |
| 35 | U-35 | Home loses the card "Exam — Coming soon". The guided Radio loses the sentence about a "next layer". | The two are promises that this change does not keep. The plan rules out an Exam station. | UX-25, UX-36 | S | LOW | U1 | yes |
| 36 | U-36 | The Yard keeps the sound choice of the learner between visits. "Reset my progress" also clears that choice. | Today the Yard turns its sound off at each visit when Read aloud is off. | UX-26, ENG-20 | S | LOW | U1 | yes |
| 37 | U-37 | A signal entry shows each different drawing one time, and the Drill draws each one time. The button "Drill these aspects" gets a name that says what it does. (words) | Each of the 38 entries with drawings shows one drawing two times. The button opens a session over all signals. | UX-40 | S | LOW. Display and selection code only. | U1 | yes |
| 38 | U-38 | In the Drill feedback, "Next" is the main control and "Look it up" is a text link. | "Look it up" is 850 px wide and "Next" is 78 px wide. | UX-30 | S | LOW | U1 | yes |
| 39 | U-39 | Yard small items: a key for the picker marks, no empty banner box, a "wait" line during the arrival, calm words in the list refusal. | The marks ✓ and → have no key. Clicks during the arrival get no answer for about 5 s (one run). | UX-31, A11Y-18 | S | LOW | U1 | yes |
| 40 | U-40 | One thing has one name and one place: the way back to Home, "couplings", "session". (words) | "← Home" and "Back to the path" go to the same screen. "Session" and "Run" name the same thing. | UX-29 | S | LOW | U1 | yes |
| 41 | U-41 | An icon in a control is decoration: a screen reader does not read it as a part of the name. | Emoji are a part of the control names today. The reskin moves each icon, and R3 says that the spoken name needs a ruling. | UX-33, A11Y-28 | S | LOW. What a screen reader says: not verified. | B1, B2 (addition) | yes |
| 42 | U-42 | The tip link stays. It says that it opens a new tab, and it does not send the page address to the tip site. | The link opens a new tab with no notice. Its address holds an account name (fence item 14). A "yes" accepts that. | A11Y-28, ENG-19, ENG-17 | S | LOW | U1 | yes: the link is a working control |
| 43 | U-43 | A gate fails when the offline cache is larger than 5 MB. | `SPEC.md` sets the budget and no gate checks it. The cache is 609,219 bytes today (11.6 %). | ENG-22 | S | LOW | G1 (addition) | yes: U-30 adds a file |
| 44 | U-44 | Tests also cover the Drill selection, the grading guards, the signal drawing and the Radio options. | A wrong selection or a wrong schedule misleads a learner, and no test finds it today. | ENG-06 | M | LOW. Logic moves to pure functions with no change of behaviour. | G1 (tests); U1 (the move) | yes: U-01 and U-37 change the selection |
| 45 | U-45 | Four places may keep a raw colour, each one marked: the web manifest, the browser bar colour, the favicon file, the desktop window colour. | No token can reach these places. Without this the raw-colour gate cannot reach zero. It is an exception to fence item 4. | ENG-09 | S | LOW | G1 | yes |
| 46 | U-46 | The new Yard files are written in TypeScript, and the link between the app and the two stations has a named type. | 61 % of the source lines have no type check. Y1 writes these files in any case. | ENG-13 | M | LOW | Y1 (addition) | yes |
| 47 | U-47 | The build tools and the router are updated to clear the security advisories. | 15 packages have an advisory. 2 of them are in the shipped app. The advisory text: not verified. | ENG-18 | S | MEDIUM. It changes the shipped code. It needs an exception to fence item 10. | G1 | no: no gain for a learner now; make it a change of its own later |
| 48 | U-48 | The first Drill session draws from a fixed starter list. | The first session is a cold draw from all domains. | UX-11 | M | MEDIUM | U1 | no, not now: the owner and the SME must pick the items first |
| 49 | U-49 | The app gets a content security policy. | Neither shell has one. A trial passed in Chromium. | ENG-19 | S | MEDIUM. A wrong policy gives a blank app. The desktop shell: not verified. | U1 | no: it cannot be proved in the desktop build from here |
| 50 | U-50 | The numbers of the learning model move from code to one settings module, with no change of a value. | A decision record says that such numbers belong in a settings file. | ENG-16 | M | MEDIUM. These numbers are the learning model. | U1 | no: no gain for a learner; do it after the tests exist |
| 51 | U-51 | The desktop set-up is tidied: the development port agrees in the two files, and the version is read from one place. | The two files name different ports. The version is in five places. | ENG-11 | S | MEDIUM. Nothing here can run the Windows build: not verified. | none yet | no: it waits for a session that can make the Windows build |

Links between rows:

- U-05 comes before U-18. A bad file must not blank the app.
- U-08 comes before U-02. The row mark uses the corrected label.
- U-16 comes after Y4. The words depend on the new switch controls.
- U-14, U-21 and U-22 edit `radioSim.js` outside the `STEPS` wording. The hash gate of G1 must
  cover the `STEPS` wording only (section 7, item 2).
- U-07 gives the learner a message and a "Reload" control when a station does not load. U-10
  prevents that fault at a release. With a "no" to U-10 and a "yes" to U-07 the learner is not
  blocked.
- U-13 holds one pick: motion is reduced when the learner's choice is on or when the device flag is
  on (R5 pick 1, recommended). The other option is that the learner's choice always wins.
- U-17 holds one pick: the entry opens on top of the station (R4 pick 5, the fix of the report).
- U-01, U-08, U-11 and U-37 change app code only. Each one has an open content question for the SME
  (notes S-01, S-13, S-04, S-05, S-14). No row waits for that answer, and no row edits the data.

## 3. Already in the plan

Each line is inside a planned job, by the plan text or by the "Fence:" line of its finding. The
owner's yes or no is not needed. The last column says what the job brief must name, so that the
work is not lost.

| Id | The work | Findings | Job | The brief must name |
|---|---|---|---|---|
| P-01 | "Reduce motion" stops the Yard motion. The end state is painted one time. | UX-02, A11Y-04 | Y4 | The setting is read at each move. The watch mode and the arrival get a static form. Plan fact T4 is wrong in direction: the setting makes a move 5.7 times slower today. |
| P-02 | A keyboard path to each Yard switch: one page button for each switch, with the position in words, 44 px. | A11Y-01, UX-08, A11Y-14 | Y4 | Six targets of 44 px do not fit on the drawing at 390 px wide. The page buttons give the 44 px path. The phone pick is Gate A, question 2. |
| P-03 | A text mirror of the yard state. The canvas has a name. The view has a heading. The banner is announced. | A11Y-03, UX-08, UX-20 | Y4 | The live region of the banner. The SME reads the mirror before it ships (R5 note 5). What a screen reader says: not verified. |
| P-04 | A Yard drawing that can be read: text of 12 px or more at 390 px wide, or page labels. The switch position has a shape. Colours come from bridge tokens. | UX-08, A11Y-12, A11Y-16, A11Y-17, ENG-09 | Y2 | The canvas reads its colours from the tokens at run time, or the raw-colour gate fails. |
| P-05 | Each page control is 44 px or more (24 kinds are smaller today). | A11Y-14, UX-20 | B1, B2, B3, Y3 | The list of R5 section 9. The Settings toggle and the two "summary" controls. |
| P-06 | The three type modes reach the Yard and the guided Radio (sizes in `rem`, colours from bridge tokens). | A11Y-15, UX-16 | Y1, Y3, B3 | The pass check of A11Y-15. |
| P-07 | Contrast AA: 4 text pairs and 7 non-text values fail today. | A11Y-17, UX-13, UX-25 | S1, B1, B2, Y2, Y3 | The pairs of R5 section 10. The Yard hint text. |
| P-08 | A focus ring on the five Settings toggles. | A11Y-08, UX-32 | B1 | One style rule. The fix was tried in the running page. |
| P-09 | The state of a Settings toggle shows with an operating system contrast theme. | A11Y-27 | B1 | A transparent border on the knob. The fix was tried in the running page. |
| P-10 | The spacing of the dyslexia setting reaches buttons and inputs. | A11Y-20 | B1, B2 | Two `inherit` rules. |
| P-11 | The Yard job picker does not make the page scroll sideways at 320 px wide. | A11Y-26 | Y3 | One style rule. The fix was tried in the running page. |
| P-12 | Correct roles in the Reference list. The "No match" text is outside the list. | A11Y-21, UX-32 | B2 | Markup only. No word changes. |
| P-13 | Settings: a plain text for the reset row. Each toggle is tied to its second line. | A11Y-28, UX-32 | B1 | Markup only. No visible word changes. |
| P-14 | Rules in the app sheet stop the Dusk motion when the app setting is on. | A11Y-07 | S1 | The three rules of R3 section 5.4. The Dusk copy does not know the app setting and cannot be edited. |
| P-15 | Each station icon moves into the Dusk icon part. | UX-33, A11Y-28 | B1, B2 | Plan fact T10. A new icon set as a part of the plan: not verified. The spoken name is row U-41. |
| P-16 | Dead files go. | ENG-12 | S1 | Add `public/icons.svg` and its entry in `vite.config.ts`: the file is in the offline cache today. |
| P-17 | No name collides between the app, the two stations and Dusk. | ENG-08 | S1, Y1, G1 | Bridge names that Dusk does not use. A prefix for the Yard classes. A small collision check. |
| P-18 | A check runs on each branch and each pull request. | ENG-04 | G1 | A second workflow. The last step of the deploy workflow stays (fence item 12). |
| P-19 | A pinned Node. | ENG-05 | G1 | Section 7, items 4 and 6. |
| P-20 | Unit tests for `sr`, `store` and `severity`. A browser smoke test. A look harness. | ENG-06 | G1 | The Signals route opens on a text question in about 2 of 30 loads: the smoke test needs a seed. More tests are row U-44. |
| P-21 | Lint and `tsc` are in the gate. The five lint warnings go. | ENG-14 | G1, and the job that owns each file | An ignore pattern for the frozen files. |
| P-22 | The update trial and the failed-load trials become browser tests. | ENG-01, ENG-02 | G1 | They enter the gate with rows U-07 and U-10, not before. |
| P-23 | The documents say what is true (46 drift rows). `ARCHITECTURE.md` and the page law line exist. | ENG-10 | D1 | R6 section 11. |
| P-24 | The package name is `clear-board`, with one version. | ENG-13, ENG-11 | D1, through G1 | The desktop `identifier` must not change: the profile of a desktop learner is stored under it. |
| P-25 | Names and personal history go from the files (37 places that are not frozen). | ENG-17 | D1 | R6 section 12. Six of the places are in code and configuration files: the lead names a job. The licence keeps its holder. |
| P-26 | The web app manifest: icons in PNG, one background colour, no duplicate cache entry. | ENG-15, ENG-11 | S1; Gate A, question 3 (the icon) | The icons wait for the owner's pick of the mark. A duplicate entry costs no storage. |
| P-27 | Four small defects in gate scripts and documents (ENG-20, items 2, 5, 6 and 7). | ENG-20 | G1, D1 | Item 2 is in files that no job owns: the lead names a job. |

## 4. Not offered: needs a frozen file, or is behind the fence

| Item | Why it is not offered | From |
|---|---|---|
| Remove the exclamation mark in the "Par" banner | `model.js:270` is frozen. | R4 section 4 |
| The word "couplings" in the win banner, and "coupling" for one | `model.js:271` is frozen. U-23 changes the readout word only. | R4 section 4 |
| Put the control hint inside the refusal texts | `model.js:69-72` is frozen. U-16 adds the hint outside. | R4 section 4 |
| Plain words in the puzzle hints and the tier labels; a change of the hint or refusal words | `puzzles.js` and `model.js` are frozen. | R4 section 4, R5 section 14 |
| Rule titles with a name, rule text for the 100 rules, text for `rule.573` | `public/data/*.json` is frozen, and it is rule content. Notes S-04 and S-05. | R4 section 4 |
| Change the two shared signal drawings | `signals.json` is frozen, and it is signal content. Note S-01. U-01 works in the selection code. | R4 section 4 |
| Remove the repeated drawing from each aspect list | `signals.json` is frozen. Note S-14. U-37 works in the display and selection code. | R4 section 4 |
| A gate check that fails on a shared drawing | It makes the gate red while the data is frozen. The check of U-01 reports only. | R4 section 4 |
| Stop the lamp flash in the renderer; a mark inside the drawing for a flashing lamp; a letter inside each lamp | `signal.ts` is frozen. Section 5 has the wrapper option. | R4 section 4, R5 section 14 |
| A change of the car fills | `geometry.js` is frozen. No change is necessary: each fill passes. | R5 section 14 |
| A change of the `STEPS` wording | Frozen. No finding needs it. | R5 section 14 |
| A name of a person in four comments; a folder path of a personal machine in one comment | `geometry.js:42`, `model.js:40` and `:50`, `solver.js:76`, `signal.ts:3` are frozen. A comment edit changes the hash. | R6 section 14 (ENG-17) |
| Raw colours in `signal.ts` (12) and `geometry.js` (10) | Frozen. The fence exempts them. | R6 section 14 |
| Exports with no outside use in `geometry.js`, `signal.ts` and `model.js` | Frozen. | R6 section 14 (ENG-12) |
| Layout and physics numbers as settings | `geometry.js:5-56` is frozen. `model.js` reads them. | R6 section 14 (ENG-16) |
| Move `solver.js` out of `src/` | Frozen: no move. Only the gate uses the file. | R6 section 14 (ENG-12) |
| The `TIERS` and `RULES` tables as settings | `puzzles.js:9` and `:25` are frozen. | R6 section 14 (ENG-16) |
| A scaffold job before the par-19 job | New puzzles are behind the fence (plan section 8). | R4 section 4 |
| A point-protection step on a shove | Behind the fence (D-0029). | R4 section 4 |
| An Exam station; a "test-ready" bar | Behind the fence (D-0013). | R4 section 4 |
| A softer grade for a win above par | It changes mastery numbers. It needs the owner and the SME (D-0018, open). | R4 section 4 |

## 5. Not offered: needs words or a ruling from the SME first

Each item needs signal or rule content. No agent writes that content (fence item 2). Until the SME
answers, the app shows nothing new (fence item 15). After the answer, each item can become a row.

| Item | What is blocked | Findings and notes | State until the SME answers |
|---|---|---|---|
| A text name for each signal drawing | A learner who cannot see the drawing cannot answer a signal question (HIGH in R5). The name needs a word for each lamp, a flashing lamp, a plaque and a dwarf signal. | A11Y-05, UX-32; S-16; R5 notes 1 and 3 | No name ships. After the words: effort S, job U1. |
| A flashing lamp when "Reduce motion" is on | The lamp flashes with the setting on. The flash is a part of the aspect. A still lamp needs a word that says that the lamp flashes. | UX-17, A11Y-13; S-10; R5 note 2 | The lamp flashes, as today. See the note below the table. |
| A list "Words on this screen" for the Yard and the Radio | The screens use rail words that the library does not explain. The SME supplies each line. | UX-22; S-13 | No list ships. |
| The text of the Radio card on Home | The card says "Radio & hand signals". Hand signals are in another domain since D-0022. | UX-28; S-07 | The text stays. |
| The words for a switch position, and the meaning of the switch colours | P-02 and P-03 show the position in words. `model.js` uses "normal" and "reverse". Plan fact T12 is not verified. | A11Y-12, A11Y-01, A11Y-03; S-08; R5 notes 4 and 5; R6 note 1 | Y4 uses the words of `model.js`. The SME confirms them before the mirror ships. |

Note on the flashing lamp. The owner gets one question, after the SME answers. Two reports
recommend different options. R5 (pick 2) recommends: the lamp stops at full brightness and a word
from the SME shows. R3 (section 10, pick 6) recommends: the flash stays until the SME answers,
because the flash is the meaning. Fence item 6 asks that reduced motion stops each effect. A
method for the first option was tested and needs no frozen file: the wrapper stops the animation
and sets its time to 0, and each lamp then has full brightness (8 of 8 samples). A stop with no
reset of the time can leave a lamp almost dark, which shows a different aspect.

## 6. Not offered: it cannot be proved from the cloud

| Item | Why | From |
|---|---|---|
| A pinned Rust tool chain for the desktop build | The version of the last good Windows build is not known here, and nothing here can run that build. It goes on the list of plan section 7. | ENG-23 |
| The desktop build after a change of name, version or icon | The Windows build cannot run here. Its sizes, its window, its icon and its service worker are not verified. Row U-51 is the part that an agent can edit; its recommended answer is "no" for the same reason. | ENG-11 |

## 7. Rulings for the lead

These are not rows for the owner. Each one comes from a "Fence:" line or from a list for the lead in
the reports.

1. Put one question on the flashing lamp to the owner, not two (section 5; R5 pick 2, R3 pick 6).
2. The hash gate of G1 covers the `STEPS` wording only. U-14, U-21, U-22 and job B3 edit
   `radioSim.js` outside it. Record the word tape of the Radio station before B3 starts (ENG-09,
   A11Y-09, A11Y-16, A11Y-19).
3. Widen the Files line of B3: style rules, the colour attributes of the markup, and line 145 of
   `radioSim.js` (ENG-09).
4. Widen the Files line of G1: `.nvmrc`, `.npmrc`, `.oxlintrc.json`, a new `tsconfig.tests.json`
   (ENG-05, ENG-14).
5. Name a job for the files that no job owns and that a row needs: `src/stations/imperativeStation.ts`,
   `src/stations/yard/sound.js`, `src/core/store.ts`, `src/core/types.ts`,
   `src/state/AppContext.tsx`, `src-tauri/**`, `public/icons.svg` (R6 section 16).
6. Move the Node line of the deploy workflow in the same commit that adds the unit tests to the
   gate. Use `engine-strict` only when the Node of the machine that makes the Windows build is
   known. Choose the Node line: 22 ends on 2027-04-30, 24 on 2028-04-30 (ENG-05).
7. Rule on the place of the look tool. Its own README keeps it outside a repository. The tools
   repository is private and this repository is public (R6 sections 5.7 and 7).
8. Correct plan fact T4 before a Yard brief quotes it (UX-02, A11Y-04, R6 section 2).
9. Rows that change Yard words (U-16, U-23, U-39) are given to U1 here. R4 leaves the choice of U1
   or Y3 to the lead. A changed word goes in a commit of its own, apart from a reskin commit
   (UX-29).
10. If U-50 gets a "yes" and the form is a JSON file, the file must not be in `public/data/`
    (ENG-16).
11. If U-47 gets a "yes", the update is a commit of its own, with no downgrade of the PWA plugin
    (ENG-18).

## 8. Not verified

Each mark below comes from the three reports. This merge verified none of them.

- What a screen reader says, on any route (U-19, U-20, U-22, U-41, P-03).
- A real phone, Safari, Firefox and the Tauri desktop build. All results come from headless
  Chromium.
- The "new version is ready" control of U-10. Only the waiting service worker was tried. Update
  behaviour over a long open session, and the service worker inside the desktop shell.
- The licence and the file size of the dyslexia face, and the face that each device shows today
  (U-30).
- The fix of U-34. That an installed web app and a browser tab share one profile (from model
  knowledge).
- The text of the advisories of U-47. Only the titles were read.
- The policy of U-49 in the desktop shell and in a browser other than Chromium.
- The Windows build, and the one-place version of U-51.
- The focus ring around the whole view on a real device (U-29).
- A new icon set as a part of the plan (P-15).
- The names and levels of the WCAG criteria in R5. They are from model knowledge.
- Each effort and each risk value. They are the estimates of the reports.
- The scope of the hash gate for `radioSim.js`. The gate does not exist yet.
- The forecast in A11Y-07 that the fault gets worse after the reskin.

## 9. Where each finding is

Each finding of the three reports is in a row (U), in the plan (P), or in section 5 (S5) or
section 6 (S6). The frozen parts of a finding are in section 4.

R4: UX-01 U-01 · UX-02 P-01 · UX-03 U-03 · UX-04 U-17 · UX-05 U-18 · UX-06 U-04, U-12 ·
UX-07 U-02 · UX-08 P-02, P-03, P-04 · UX-09 U-11 · UX-10 U-27, U-33 · UX-11 U-28, U-48 ·
UX-12 U-26 · UX-13 U-16, P-07 · UX-14 U-06 · UX-15 U-23 · UX-16 P-06, U-30 · UX-17 S5 ·
UX-18 U-07 · UX-19 U-05 · UX-20 P-03, P-05, U-19 · UX-21 U-32 · UX-22 S5, U-33 · UX-23 U-21 ·
UX-24 U-25 · UX-25 U-35, P-07 · UX-26 U-31, U-36 · UX-27 U-15 · UX-28 S5 · UX-29 U-40, U-22 ·
UX-30 U-38 · UX-31 U-39, U-12 · UX-32 U-22, U-29, P-08, P-12, P-13, S5 · UX-33 P-15, U-41, U-20 ·
UX-34 U-08 · UX-35 U-11 · UX-36 U-35 · UX-37 U-24 · UX-38 U-08 · UX-39 U-15 · UX-40 U-37.

R5: A11Y-01 P-02 · A11Y-02 U-09 · A11Y-03 P-03 · A11Y-04 P-01 · A11Y-05 S5 · A11Y-06 U-03 ·
A11Y-07 U-13, P-14 · A11Y-08 P-08 · A11Y-09 U-14 · A11Y-10 U-19 · A11Y-11 U-06 ·
A11Y-12 P-04, S5 · A11Y-13 S5 · A11Y-14 P-02, P-05 · A11Y-15 P-06 · A11Y-16 P-04, U-21 ·
A11Y-17 P-04, P-07 · A11Y-18 U-20, U-12, U-39 · A11Y-19 U-22 · A11Y-20 U-30, P-10 ·
A11Y-21 P-12 · A11Y-22 U-29 · A11Y-23 U-29 · A11Y-24 U-33 · A11Y-25 U-31 · A11Y-26 P-11 ·
A11Y-27 P-09, U-13 · A11Y-28 P-13, P-15, U-41, U-42 · A11Y-29 U-12.

R6: ENG-01 U-07, U-10, P-22 · ENG-02 U-07, U-05, P-22 · ENG-03 U-18, U-05 · ENG-04 P-18 ·
ENG-05 P-19 · ENG-06 P-20, U-44 · ENG-07 U-30 · ENG-08 P-17 · ENG-09 U-45, P-04, section 7 ·
ENG-10 P-23 · ENG-11 U-51, P-24, P-26, S6 · ENG-12 P-16 · ENG-13 P-24, U-46 · ENG-14 P-21 ·
ENG-15 P-26 · ENG-16 U-50 · ENG-17 P-25, U-42 · ENG-18 U-47 · ENG-19 U-49, U-42 ·
ENG-20 U-15, U-36, P-27 · ENG-21 U-34 · ENG-22 U-43 · ENG-23 S6.

## 10. Notes for the SME

Each content finding of the three reports is below, word for word, with its "Check:" lines. Nothing
is fixed. Nothing is hidden. No rule wording is proposed. The item ids are: S-01 to S-16 for R4;
"R5 note 1" to "R5 note 6"; "R6 note 1" to "R6 note 6". The notes for the SME of the other Wave 1
reports (R1, R2, R3, R7) are in those reports. They are not repeated here.

### 10.1 From R4, section 6 (S-01 to S-16)

These notes give the texts as they are. They propose no rule wording.

- **S-01. Two signal drawings belong to two indications each.**
  `{"heads":["R"],"type":"mast"}` is an aspect of `sig.437` (title "437 STOP AND PROCEED", plain
  "Stop, then proceed at RESTRICTED speed.") and of `sig.439` (title "439 STOP", plain "Stop.").
  `{"heads":["G"],"type":"dwarf"}` is an aspect of `sig.405` ("405 CLEAR SIGNAL", plain "Proceed.")
  and of `sig.431` ("431 SLOW TO CLEAR", plain "Proceed, SLOW speed passing signal and through
  turnouts."). The drill marks one of the two names wrong (UX-01). Question: is each drawing correct
  for both items?
  - Check: confirmed from the data. All four items are `verified`. The red mast lamp is entry 2 of 3
    in `sig.437` and entries 1 and 5 of 5 in `sig.439`. The green dwarf lamp is entry 2 of 4 in
    `sig.405` and entry 3 of 5 in `sig.431`.
- **S-02. Rule 112 has seven wordings in the app.**
  1. `rule.112`, plain: "Rule 112(ii): parking brakes are considered to be hand brakes."
  2. Home card (`store.ts:10`): "Rule 112 — tie it down so it stays put."
  3. Settings sample (`Settings.tsx:36`): "Rule 112 — secure unattended equipment."
  4. Yard chip (`puzzles.js:15`): "Unattended equipment gets a hand brake (secured)".
  5. Yard help (`yardSim.js:205`): "Rule 112 — any car left unattended gets a hand brake."
  6. Yard refusal (`model.js:213`): "… holds a single car — securement applies to a standing cut of 2
     or more (CROR 112)."
  7. Yard refusal (`yardSim.js:446`): "a cut left unattended gets hand brakes before you walk away
     (CROR 112)."
  Texts 5 and 6 disagree on a single car.
  - Check: confirmed. Each of the seven texts is at its cited place.
- **S-03. A Yard refusal cites a rule, and the Reference entry for that rule says a different thing.**
  - Yard: "AS71 is lined normal — line its switch reverse for the track (CROR 104)." `rule.104`:
    "Rule 104: hand-operated switches in sidings may be considered lined for the normal position
    unless advised otherwise — but verify, because 'considered' is not 'confirmed.'"
  - Yard: "That cut is too long for the lead to hold clear of the ladder — won't clear the switch
    (CROR 114)." and "… is too full — no room to spot … clear of the foul point (CROR 114)."
    `rule.114`: "Rule 114(b): a movement must not foul a track until the switches connected with the
    move are properly lined (or, for semi-automatic/spring switches, the conflicting route is known
    to be clear)."
  - Yard: "… isn't a kickable track here — kicking is only allowed where the special instruction
    says (CROR 113.4)." `rule.113.4`: "Rule 113.4 prohibits them on main track, subdivision track, a
    siding, high-risk locations, shop tracks, and onto/with passenger equipment."
  - Yard chip: "CROR 105 — Yard speed — REDUCED (stop within ½ range of vision); transfers ≤ 15
    MPH". `rule.105`: "Non-main track: REDUCED speed, not exceeding 15 MPH unless signal indication
    or special instructions allow more."
  REVAMP section 9 question 1 (each rule number in the Yard) has no recorded answer.
  - Check: confirmed. The Yard texts are at `model.js:69`, `:114`, `:126`, `:170` and
    `puzzles.js:11`. The entry texts are in `rules.json`. Added: the Yard drawing also carries the
    label "15 MPH · REDUCED (CROR 105)" (`render.js:94`).
- **S-04. `rule.573`** is `verified`, has an empty plain text, no rule text and no question.
  - Check: confirmed.
- **S-05. Rule entries.** 100 of 100 rule items have no rule text (`verbatim: null`). 97 titles are a
  number only. Some plain texts start with one paragraph label, for example `rule.112` "(ii)",
  `rule.114` "(b)", `rule.120` "(a)", `rule.113.5` "(a)". Question: is each entry meant to give the
  whole rule?
  - Check: confirmed. 20 of the 100 plain texts start with "Rule <number>(<label>)".
- **S-06. `rule.113.4`**, plain text: "Rule 113.4 prohibits them on …". The entry does not say what
  "them" is.
  - Check: confirmed.
- **S-07. Home card for Radio** (`store.ts:11`): "Radio & hand signals." Hand signals (`rule.12`) are
  in Operating since D-0022.
  - Check: confirmed.
- **S-08. Switch colours in the Yard help** (`yardSim.js:190-191`): "yellow = lined into the track /
  diverging, green = normal". The code comment in `render.js:2` calls yellow a rule convention. That
  claim is not verified (T12).
  - Check: confirmed that both texts are there. The claim itself stays not verified.
- **S-09. Kick limits and car types.** The limits "5 total / 3 loaded" and the no-kick types (tank,
  autorack, centerbeam) are in code comments as an SME call (`model.js:48-50`,
  `geometry.js:41-42`). `DECISIONS.md` has no entry for them.
  - Check: confirmed.
- **S-10. A flashing lamp under reduce motion** (UX-17). Question: is a lit, still lamp with the word
  "flashing" an acceptable picture of a flashing aspect?
  - Check: confirmed as an open question. The check showed that the wrapper can hold the lamp lit
    with no change to the frozen renderer.
- **S-11. Items that stay open from T11**, seen on screen today: `sig.410`, `sig.418`, `sig.433A`
  and `sig.440` show "⚠ not yet verified — reference only" in the entry (and no mark in the list
  row, UX-07). Six radio steps show "never scored".
  - Check: corrected. The entry of `sig.410` shows the mark. The six radio steps show "never scored"
    in the badge of the Radio test, and "never graded" in their Reference text. The four signal
    items have an empty aspect list, so their entries show no drawing.
- **S-12. The label "Safety-critical — lock this one in."** appears on each miss of an item that
  `severity.ts` puts in S3 (103 items by D-0024). The file says that the SME owns this list.
  - Check: corrected. The count 103 is the count of D-0024 over the 205 items that are not radio
    steps. 98 of the 103 can come up in the Drill; the other 5 are the 4 `needs-review` signals and
    `rule.573`.
- **S-13. Added by the check. Four radio steps and the label "CN practice (GOI)".** Reference shows
  "● CN practice (GOI), not a CROR rule" on `radio.joint.06`, `.08`, `.09` and `.10`. Their source in
  the data is "SME", and their text says that no paragraph is cited (UX-38). Question: which label
  is true for these four steps? A second question from UX-22: the Yard and the Radio use the words
  cut, lead, ladder, throat, foul point, joint, par, spot, shove, bad-order, manifest and special
  instruction, and the library has no entry for them. Does the SME supply a line for each word?
- **S-14. Added by the check. Each aspect list holds one repeated drawing.** 38 of 38 signal items
  with drawings have one drawing two times (140 entries, 102 different). In 20 items the last entry
  repeats the first. Example, `sig.437`: red over red staggered, one red, red over red staggered.
  Question: is each repeat intended, or does a list lack a drawing that the repeat stands for?
- **S-15. Added by the check. The four `needs-review` signal items have no drawing** (`aspects: []`).
  Reference shows their indication text and the rule text control. Question for the SME review of
  T11: is the text of these four entries safe to show before the review ends?
- **S-16. Added by the check. The words that describe a signal picture.** Each signal picture has no
  text name (UX-32). A name such as a list of lamp colours is signal content. Question: which words
  does the SME accept for a lamp colour, a flashing lamp, a plaque and a dwarf signal?

### 10.2 From R5, section 15 (R5 note 1 to R5 note 6)

1. **Words for a signal text alternative (A11Y-05).** The alternative needs a word for each lamp
   code in `signal.ts` (`G`, `R`, `Y`, `L`, `D`), for the `f` suffix, for "mast" and "dwarf", for the
   plates `DV`, `R` and `L`, and for a staggered head. The code holds letters only. The SME gives the
   words. This report proposes none. Counted from the data (read only): `signals.json` uses the
   codes `G`, `R`, `Y`, `Gf`, `Yf` and `Rf`, the types mast and dwarf, the plates `DV`, `R` and
   `L`, and 18 staggered aspects of 140. The codes `L` and `D` are in `signal.ts` and not in the
   data.
2. **A flashing lamp with reduced motion (A11Y-13).** In `signals.json` the flash is the only
   difference between some aspects. If the flash stops, a word must say that the lamp flashes. The
   SME says whether a still lamp with a word is an acceptable picture of a flashing aspect, and
   gives the word. Counted from the data (read only): 25 of the 42 signal items have a flashing lamp, and in
   29 groups of aspects the flash is the only difference between different items. The flash rate in
   the drawing is 1 each second; whether this is a correct picture of the real rate is not verified.
3. **Colour as the carrier of a signal aspect.** The drawing shows red, yellow and green by colour
   only. This is the nature of a signal. The SME says whether a colour word in the text alternative,
   or a visible aid, is acceptable in a recognition drill.
4. **Switch position (A11Y-12, T12).** The fix needs a word for each position in the DOM and a
   shape in the drawing. `model.js` uses "normal" and "reverse". The SME confirms the words, and
   whether yellow for a diverging switch is a convention. The help text of the Yard explains the
   two positions with the colour words only (`yardSim.js:189-191`).
5. **The text mirror of the Yard (A11Y-03).** It will state the track contents and the words TIED,
   LOOSE and KICKABLE as text. The words come from `render.js` and `model.js`. The SME reads the
   mirror before it ships.
6. **One drawing, two indications.** UX-01 found it. A text alternative for the drawing is then
   equal for two indications. No action here; it is for the SME with UX-01. Counted from the data
   (read only): 2 drawings are equal under two or more items.

- Check: corrected. Each note was read against the fence: the notes hold no rule wording and no
  proposed word. Changed: note 2 quoted a word for a lamp; it now asks the SME for the word.
  Counts from `signals.json` are added to notes 1, 2 and 6, and one code line to note 4. The check
  did not judge any rule content.

### 10.3 From R6, section 15 (R6 note 1 to R6 note 6)

No rule wording is proposed here.

1. `src/stations/yard/render.js:2` says that the yellow target for a diverging switch is a "CROR
   yard convention" (plan fact T12). This audit found nothing in the repository that supports the
   claim. `render.js` is not frozen, but the claim is about a rule.
2. `src/core/severity.ts:11-23` decides which misses show the words "Safety-critical — lock this
   one in". Its own header calls the table "a reviewable v1" and asks the SME to adjust it. No
   decision entry records that the SME has reviewed the seven domain defaults and the eleven
   overrides.
3. `SPEC.md:149` gives a count of signal variants ("136", "~100") that differs from the data: 42
   indications with 140 aspects. Which count is right is a content question.
4. `index.html:9` describes the product as a trainer for one named railway. The manifest and the
   README describe it by the rule book. Which description is correct for the content is the
   SME's and the owner's call.
5. Added by the check. `src/stations/radioSim.js:76` (the tip under the note box) states which
   items of the walkthrough are operating practice and which are rules, and what the engineer
   repeats. The line is outside `STEPS`, so the hash gate does not protect it. Whether the
   statement is right is the SME's. A restyle of the island must not change it.
6. Added by the check. `src/core/store.ts:10` and `:12` put a rule number and four system names
   into the text of two domain cards on Home. The file is not frozen. Whether the text is right
   is the SME's.

Check: confirmed. Each cited line was opened. Notes 1 to 4 are as written: `render.js:2`,
`severity.ts:1-23` with 7 defaults and 11 overrides, D-0024 (`DECISIONS.md:274-296`) records no
review of the table by the SME, `SPEC.md:149`, `index.html:9`. No note proposes rule wording.
