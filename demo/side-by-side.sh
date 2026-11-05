#!/usr/bin/env bash
# Runs both demo branches at once:  A (without 4D) → http://localhost:5174   B (with 4D) → http://localhost:5175
# Ctrl+C stops everything.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
WT="$ROOT/../support-desk-demo-worktrees"
mkdir -p "$WT"
for pair in "a:demo/without-4d" "b:demo/with-4d"; do
  dir="$WT/${pair%%:*}"; branch="${pair#*:}"
  [ -d "$dir" ] || git -C "$ROOT" worktree add -q "$dir" "$branch"
  [ -e "$dir/node_modules" ] || ln -s "$ROOT/node_modules" "$dir/node_modules"
done
trap 'kill 0' EXIT
(cd "$WT/a" && PORT=4001 npx tsx server/src/index.ts) &
(cd "$WT/a/web" && API_PORT=4001 WEB_PORT=5174 npx vite --strictPort) &
(cd "$WT/b" && PORT=4002 npx tsx server/src/index.ts) &
(cd "$WT/b/web" && API_PORT=4002 WEB_PORT=5175 npx vite --strictPort) &
echo "A (without 4D): http://localhost:5174/tickets"
echo "B (with 4D):    http://localhost:5175/tickets"
wait
