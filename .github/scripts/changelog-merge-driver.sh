#!/usr/bin/env bash
# git merge driver wrapper: changelog-merge-driver.sh %O %A %B  (result goes to %A)
set -e
python3 "$(dirname "$0")/merge_changelog.py" "$1" "$2" "$3" "$2.merged" && mv "$2.merged" "$2"
