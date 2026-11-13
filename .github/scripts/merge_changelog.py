#!/usr/bin/env python3
"""Merge for the Vault Changelog plugin's Changelog.md.

The plugin regenerates this file from scratch: one row per note, newest first,
capped at "max recent files". So the right merge is not a line merge but
"what the plugin would write if it saw both sides":

  rows = (OURS u THEIRS) minus rows either side deleted,
         one row per note (newest timestamp wins),
         optionally only notes that still exist (--tree),
         newest first, capped at the larger of the two sides' row counts.

usage: merge_changelog.py BASE OURS THEIRS OUT [--tree]
Exits 1 (with a message) if the file isn't in the plugin's default
'- YYYY-MM-DDTHHMM · name' row format, so it never silently corrupts a
custom datetime format.
"""
import re
import subprocess
import sys

ROW = re.compile(r"^- (\d{4}-\d{2}-\d{2}T\d{4}) · (.+)$")


def parse(path):
    """-> (header_lines, rows). A heading (anything before the first row) is kept."""
    with open(path, encoding="utf-8") as f:
        lines = [l.rstrip("\r\n") for l in f]
    header, rows, started = [], [], False
    for line in lines:
        m = ROW.match(line)
        if m:
            started = True
            rows.append((m.group(1), m.group(2)))
        elif not line.strip():
            if not started:
                header.append(line)
        elif started or line.startswith("- "):
            sys.exit(f"Unrecognised line in {path} (custom datetime format?), "
                     f"refusing to auto-merge: {line!r}")
        else:
            header.append(line)
    return header, rows


def note_ids(name):
    """Possible identities of a row's note: [[Path/Note#h|alias]] or plain path/basename."""
    n = name.strip()
    if n.startswith("[[") and n.endswith("]]"):
        n = n[2:-2]
    n = n.split("|")[0].split("#")[0]
    if n.endswith(".md"):
        n = n[:-3]
    return {n, n.rsplit("/", 1)[-1]}


def existing_notes():
    out = subprocess.run(["git", "ls-files", "-z", "--", "*.md"],
                         capture_output=True, text=True, check=True).stdout
    ids = set()
    for p in filter(None, out.split("\0")):
        p = p[:-3]
        ids.add(p)
        ids.add(p.rsplit("/", 1)[-1])
    return ids


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    use_tree = "--tree" in sys.argv
    base_h, base = parse(args[0])
    ours_h, ours = parse(args[1])
    theirs_h, theirs = parse(args[2])

    removed = (set(base) - set(ours)) | (set(base) - set(theirs))
    best = {}  # name -> timestamp (newest wins)
    for ts, name in ours + theirs:
        if (ts, name) in removed:
            continue
        if use_tree and not (note_ids(name) & existing):
            continue
        if name not in best or ts > best[name]:
            best[name] = ts
    rows = sorted(((ts, n) for n, ts in best.items()), key=lambda r: r[0], reverse=True)
    rows = rows[: max(len(ours), len(theirs))]

    header = ours_h if any(l.strip() for l in ours_h) or not any(l.strip() for l in theirs_h) else theirs_h
    text = "\n".join(header + [f"- {ts} · {n}" for ts, n in rows]) + "\n"
    with open(args[3], "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


existing = existing_notes() if "--tree" in sys.argv else set()
main()
