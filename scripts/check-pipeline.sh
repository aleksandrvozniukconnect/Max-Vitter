#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
fail=0

need=(
  ".cursor/rules/iai.mdc"
  ".cursor/environment.json"
  "work/new-site/README.md"
  "work/new-site/BRIEF.md"
  "work/new-site/specs/01-brain.md"
  "work/new-site/specs/02-concept.md"
  "work/new-site/specs/03-structure.md"
  "work/new-site/specs/04-visual.md"
  "work/new-site/specs/05-motion.md"
  "work/new-site/specs/06-platform.md"
)

for f in "${need[@]}"; do
  if [[ ! -f "$root/$f" ]]; then
    echo "missing: $f" >&2
    fail=1
  fi
done

python3 -m json.tool "$root/.cursor/environment.json" >/dev/null

if grep -Eiq 'seamless|cutting-edge|elevate your|dive in|у сучасному світі|безшовн|зануртеся' \
  "$root/work/new-site/specs/06-platform.md" \
  "$root/work/new-site/README.md" \
  "$root/work/new-site/BRIEF.md"; then
  echo "voice: banned phrase leaked into pipeline files" >&2
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi

echo "pipeline ok"
