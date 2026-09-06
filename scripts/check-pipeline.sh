#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
fail=0

need=(
  ".cursor/rules/iai.mdc"
  ".cursor/environment.json"
  "README.md"
  "BRIEF.md"
  "specs/01-brain.md"
  "specs/02-concept.md"
  "specs/03-structure.md"
  "specs/04-visual.md"
  "specs/05-motion.md"
  "specs/06-platform.md"
)

for f in "${need[@]}"; do
  if [[ ! -f "$root/$f" ]]; then
    echo "missing: $f" >&2
    fail=1
  fi
done

python3 -m json.tool "$root/.cursor/environment.json" >/dev/null

if grep -Eiq 'seamless|cutting-edge|elevate your|dive in|у сучасному світі|безшовн|зануртеся' \
  "$root/specs/06-platform.md" \
  "$root/README.md" \
  "$root/BRIEF.md"; then
  echo "voice: banned phrase leaked into pipeline files" >&2
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi

echo "pipeline ok"
