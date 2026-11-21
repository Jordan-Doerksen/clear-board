#!/usr/bin/env bash
# The lead's check of a tree: the frozen set, the STEPS region (found by its markers), and the gates.
# Usage: merge-check.sh <tree> <port> [--no-browser]
set -u
T="$1"; P="$2"; NB="${3:-}"
S="${CB_LEAD_SCRATCH:?set CB_LEAD_SCRATCH to a folder that holds frozen/files-94a41c5.sha256}"
cd "$T" || exit 2
echo "== tree $T at $(git rev-parse --short HEAD) on $(git branch --show-current)"
echo "== frozen files vs 94a41c5"
sha256sum -c --quiet "$S/frozen/files-94a41c5.sha256" && echo "frozen: 10 of 10 equal"
steps() { awk '/^export const STEPS = \[/{p=1} p{print} p&&/^\];/{exit}'; }
A=$(git show 94a41c5:src/stations/radioSim.js | steps | sha256sum | cut -c1-16)
B=$(steps < src/stations/radioSim.js | sha256sum | cut -c1-16)
N=$(steps < src/stations/radioSim.js | wc -l)
if [ "$A" = "$B" ]; then echo "STEPS region equal ($N lines, $B)"; else echo "STEPS region DIFFERS: base $A now $B"; fi
echo "== git status"; git status --short | head -20
echo "== npm run check"; npm run check > "$S/mc-check.log" 2>&1; echo "check exit $?"; tail -15 "$S/mc-check.log"
echo "== npm run build"; npm run build > "$S/mc-build.log" 2>&1; echo "build exit $?"; tail -5 "$S/mc-build.log"
if [ "$NB" != "--no-browser" ]; then
  echo "== npm run test:browser"; CB_PORT=$P npm run test:browser > "$S/mc-browser.log" 2>&1; echo "test:browser exit $?"; tail -22 "$S/mc-browser.log"
fi
