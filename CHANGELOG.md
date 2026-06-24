# Changelog

## [Unreleased] — V1 in progress
### Added
- Design gate (2026-06-23): `SPEC.md`, `DECISIONS.md`, adversarial `GAP-REVIEW.md` — **gate-clean for V1**.
- Project scaffold: README, MIT LICENSE, .gitignore, this changelog.
- Runnable shell (`index.html`): qualification-path home, accessible dark theme, settings
  (reduced-motion, dyslexia font, text size, read-aloud, high contrast), local profile skeleton.
- **Shared core** as ES modules: `core/sr.js` (SM-2-lite spaced repetition) + `core/store.js`
  (profile, content loader, mastery, gradable-only filter).
- **Content library**: `data/definitions.json` — 63 CROR definitions migrated verbatim from the
  old CROR Quiz, character-for-character verified, cited + `trust:"verified"`.
- **Reference station** (`stations/reference.js`): search, plain-language first, rule text one tap
  deeper, trust badge + citation.
- **Drill station** (`stations/drill.js`): adaptive MC (term↔definition), SM-2 scheduling, citation
  on every answer, mastery feeds the path. F1 enforced — only verified items are graded.
- `app.js`: modular shell with hash routing (home / reference / drill) + settings.
- Verified end-to-end on preview (home, search→detail→verbatim, answer→grade→mastery persist).

### Next
- Migrate the **signals** domain (the SVG aspect renderer + ~100 indications, `needs-review` flags
  on the 4 unencoded ones) so Drill spans a second content type.
- Then: rules/operating content, the Yard (switch-list engine), Radio, and the Exam station.
- PWA/offline (service worker + manifest); profile export/import; tip-jar link.
