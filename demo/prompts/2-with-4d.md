# Run B — "with 4D" (Delegation · Description · Discernment · Diligence)

**Branch:** `demo/with-4d` (starts from `main`: CLAUDE.md + skills + subagents present)

## 1. Delegation: decide who does what before typing
- **Claude:** explore the code, propose a plan, implement API + UI + tests.
- **Me:** choose UX, approve the plan, review the diff, own the merge.
- Start in **Plan mode** (Shift+Tab twice) so nothing gets written until I approve.

## 2. Description: the prompt
```
Support agents triage ~60 new tickets a day and need to find "urgent open tickets
for enterprise customers" quickly. Add filtering to the Tickets page.

Requirements
- Filter by status and priority (multi-select) and free-text search over
  subject, customer name, email and ticket ID.
- Filtering must happen on the server: results and pagination totals have to be
  correct across all 64 tickets, not just the current page.
- Filters live in the URL so a filtered view can be bookmarked or pasted in Slack.
- Changing a filter resets to page 1. Search is debounced.
- Empty result shows "No tickets match these filters" with a Clear button.
- Accessible: labelled controls, result count announced to screen readers.

Constraints
- Follow CLAUDE.md, web/CLAUDE.md and server/CLAUDE.md. Use the add-api-endpoint skill for the API part.
- No new dependencies.

Done means
- Typecheck + tests pass; tests cover filter combos, invalid input (400),
  pagination over filtered results, URL restore, and the empty state.

First: read the relevant code and give me a plan. Don't write code until I approve.
```

## 3. Discernment: check the output, don't trust it
- Read the plan: is filtering in the repository? Is `total` post-filter? Push back if not.
- After implementation: `use the code-reviewer subagent to review this branch`
- Run it: filter Urgent → expect **9 results, Page 1 of 1**. Refresh → filters persist. Paste URL in a new tab.
- Ask: "What edge cases did you NOT test?"

## 4. Diligence: own what ships
- Input validated server-side (zod, max length on `q`) → bad URLs return 400, not 500.
- No PII in logs (server/CLAUDE.md rule).
- I read every line of the diff before merging; PR says AI-assisted.
- CHANGELOG updated so support knows what changed.
