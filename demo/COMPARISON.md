# Same feature, two ways: scorecard

Feature: *filter the Tickets list by status, priority and search.*
Screenshots: `demo/screenshots/without-4d.png` vs `demo/screenshots/with-4d.png` (both filtered to **Urgent**).

| | Without 4D | With 4D |
|---|---|---|
| Prompt | 6 words | ~20 lines + plan approval |
| Filter "Urgent" shows | **3 tickets, "Page 1 of 4"** ❌ | **9 tickets, "Page 1 of 1"** ✅ |
| Where filtering happens | Browser, current 20 rows only | Server (repository), all rows |
| Search covers | Subject only | Subject, customer, email, ticket ID |
| Multi-select | No (one status at a time) | Yes (`?status=open,pending`) |
| Refresh / share link | Filters lost | Filters in URL, shareable |
| Page reset on filter change | No (can land on empty page 3) | Yes |
| Empty state | "No tickets yet" (wrong message) | "No tickets match these filters" + Clear |
| Accessibility | Placeholder-only input, unlabeled selects | Labels, `role=search`, `aria-pressed`, live result count |
| Styling | Inline styles, hard-coded `#ccc` | CSS Module + design tokens |
| Input validation | n/a | zod: bad status → 400, `q` ≤ 100 chars |
| New tests | **0** | **16** (8 API, 8 UI) |
| Typecheck/tests pass | Yes (nothing tested the new code) | Yes |
| Files changed | 1 (+35 lines) | 13 (+438 lines) |

**The point:** both versions "work" in a 10-second click-through. Only one is shippable.
Version A passes CI because nothing tests it. That's the risk you're paying for with a 6-word prompt.

Reproduce:
```bash
git diff baseline demo/without-4d --stat
git diff main demo/with-4d --stat
```
