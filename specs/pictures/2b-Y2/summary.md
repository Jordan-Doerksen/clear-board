# Job Y2 — the summary of the proof (requirement 40)

Written by the lead on 2026-11-21 from the reports of the build and of the independent review of
job Y2. The build agent and the review agent could not write this file: their tool refused a new
report file. Each number below is from those reports; the review ran each one again on its own
builds.

## The tape of the game behaviour

- The recorder of job Y1 ran on the start build (`936f6ff`), and an adapted copy ran on the build
  of job Y2. The adapted copy reads the drawing fields of the new picture; each other field is the
  field of Y1.
- Passes A, B, C and D hold 238, 30, 6 and 4 records. 0 records differ in any pass.
- 130 records differ only in the last digits of a domain mastery. That value depends on the time.
- Pass C, the median time of one move: 1535 ms at the start and 1613 ms after (ratio 1.05), with
  "Reduce motion" off; 8954 ms and 9309 ms (ratio 1.04) with it on. The change is requirement 35:
  a travel leg takes 840 ms in and 420 ms out (`R7-P4`). Reduced motion still makes a move slower;
  job Y4 stops it in Wave 2c (`MOTION-STOP-OWNER`).
- The edge section: a line 1 px inside the lined track AS73 is lit 4 of 4 times; a line 3 px
  outside it is lit 0 of 4 times.

## The two compact tapes

The files in the folder `tapes/` beside this file hold the compact form of the two tapes. The
full tapes stay in the scratch folder of the job.

## Not met, and accepted by the lead

- Requirement 43, the arrival at 390 px with the processor slowed four times: one or two late
  frames in two of three runs. The late frame is the layout at the start of a job. The travel
  frames are on time. Accepted for Wave 2b; job Y4 makes the arrival a learner action (`R7-P5`).
- Requirement 26 at the page: the page scrolled sideways at 320 px because of the job picker of
  the chrome. Job Y3 removed it; the smoke case "yard at 320" counts 0 after the merge.
