#!/usr/bin/env bash
# Merge origin/main into the current branch. Only Changelog.md conflicts are auto-resolved.
set -euo pipefail
BASE_BRANCH="${BASE_BRANCH:-main}"
CHANGELOG="Changelog.md"
HERE="$(cd "$(dirname "$0")" && pwd)"

git fetch --no-tags origin "$BASE_BRANCH"
if git merge-base --is-ancestor "origin/$BASE_BRANCH" HEAD; then
  echo "Already up to date with $BASE_BRANCH."; exit 0
fi

if git merge --no-ff --no-edit "origin/$BASE_BRANCH"; then
  echo "Merged cleanly."; exit 0
fi

conflicts="$(git diff --name-only --diff-filter=U)"
if [ "$conflicts" != "$CHANGELOG" ]; then
  echo "::error::Conflicts outside $CHANGELOG need a human:"; echo "$conflicts"
  git merge --abort; exit 1
fi

tmp="$(mktemp -d)"
git show ":1:$CHANGELOG" > "$tmp/base" 2>/dev/null || : > "$tmp/base"
git show ":2:$CHANGELOG" > "$tmp/ours"
git show ":3:$CHANGELOG" > "$tmp/theirs"
if ! python3 "$HERE/merge_changelog.py" "$tmp/base" "$tmp/ours" "$tmp/theirs" "$CHANGELOG" --tree; then
  git merge --abort; exit 1
fi
git add "$CHANGELOG"
git commit --no-edit -m "Merge $BASE_BRANCH into $(git rev-parse --abbrev-ref HEAD) (auto-resolved $CHANGELOG)"
echo "Resolved $CHANGELOG conflict."
