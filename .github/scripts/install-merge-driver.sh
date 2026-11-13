#!/usr/bin/env bash
# Run once per clone (e.g. on each machine using Obsidian Git) so local merges,
# pulls and rebases resolve Changelog.md the same way the GitHub Action does.
set -e
cd "$(git rev-parse --show-toplevel)"
git config merge.changelog.name "Vault Changelog merge"
git config merge.changelog.driver ".github/scripts/changelog-merge-driver.sh %O %A %B"
echo "Installed. (Changelog.md is mapped to this driver by .gitattributes.)"
