---
name: release-notes
description: Write customer-facing release notes and a CHANGELOG.md entry from the commits since the last release. Use when the user asks for release notes, a changelog entry, "what shipped", or to prepare a version bump.
---

# Release notes (house style)

1. Find the last version in `CHANGELOG.md` and run `git log --oneline <last-tag-or-date>..HEAD`.
2. Group changes into **New**, **Improved**, **Fixed**. Drop internal-only commits (tests, refactors, CI) unless they change behavior.
3. Write for a support agent, not an engineer: say what they can now do, in one line each. No ticket IDs, no file names.
4. Bump the minor version for features, patch for fixes only. Today's date.
5. Prepend the entry to `CHANGELOG.md` and show the user a 3-bullet Slack-ready summary too.
