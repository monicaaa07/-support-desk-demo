# Talking points: "Getting production-quality work out of Claude Code"

**Runtime:** ~40 min · **Audience takeaway in one line:**
> Claude Code's output quality comes from how you work with it, not from the model alone.
> The 4D habits plus CLAUDE.md, skills and subagents are how a team makes that quality repeatable.

---

## 0. Opening (2 min): why we're here
- "Most people's first Claude Code experience is a one-line prompt and a result that *looks* right. Today I'll show why that's the most expensive way to use it."
- What you'll leave with:
  1. A repeatable way to prompt for production work (the **4D framework**)
  2. How to make that context permanent (**CLAUDE.md**)
  3. How to package team workflows (**skills**) and delegate side-work (**subagents**)
  4. How to keep long sessions sharp (**context management**)
- **Value add:** fewer review cycles, fewer escaped bugs, and juniors and seniors get the same quality from the tool.

## 1. The codebase (3 min): it looks like *your* repo
Open `README.md` and the tree.
- Real shape: npm monorepo, Express + zod API with routes → service → repository, React + Vite UI, CSS Modules + design tokens, Vitest/Testing Library/supertest, CI workflow, ADRs, CHANGELOG.
- "It has conventions an outsider wouldn't guess. That's exactly what trips up AI and new hires."
- `npm run dev` → show Dashboard → Tickets → a ticket detail.

## 2. Demo: same feature, two ways (12 min)
**The use case:** support agents need to find "urgent open tickets" fast. Today they page through 64 tickets by hand.

### Run A: without 4D (`demo/prompts/1-without-4d.md`)
- Prompt: `add filters to the tickets page`. Accept the first answer.
- Show it in the browser (`demo/side-by-side.sh` → :5174). Select **Urgent**.
- **Pause for effect:** "3 urgent tickets. Page 1 of 4." Click Next: more urgent tickets were hidden on other pages.
- "It compiled. CI is green. A reviewer skimming the diff would probably approve it. **It's wrong**, and it would have told an agent there are only 3 urgent tickets."
- Also: refresh loses the filters, there are no tests, styles are inline, and the inputs have no labels.

### Run B: with 4D (`demo/prompts/2-with-4d.md`)
Walk the four Ds. Each one is a habit, not a tool:
| D | What it means | What I did here | Value |
|---|---|---|---|
| **Delegation** | Decide what Claude does vs. what you own | Plan mode first; I own UX and approval | No surprise rewrites; human stays accountable |
| **Description** | Give the context a new teammate would need | Who the user is, the requirements, constraints, done criteria | Claude solves *your* problem, not a generic one |
| **Discernment** | Evaluate the output critically | Review the plan, code-reviewer subagent, click-test, "what didn't you test?" | Catch the 3-vs-9 bug before users do |
| **Diligence** | Take responsibility for what ships | Validation, no PII in logs, read the diff, disclose AI use | Safe, auditable, owned |

- Show :5175 → Urgent → **9 tickets, Page 1 of 1**. Refresh, still filtered. Copy the URL into a new tab. Search "priya". Hit an empty state.
- Open `demo/COMPARISON.md`. **Key line:** "Both versions 'work' in a 10-second demo. Only one is shippable. A has 0 tests, B has 16."
- **Value add:** two extra minutes of prompting saved a bug, a review cycle and a follow-up ticket. Writing the prompt is cheap. Shipping a bug is expensive.

**Anticipated Q:** "Isn't the long prompt slower?" → About 2 minutes slower. Then point to part 3: most of that prompt can live in CLAUDE.md permanently.

## 3. CLAUDE.md (6 min): make Description permanent
Open `CLAUDE.md`, then `web/CLAUDE.md` and `server/CLAUDE.md`.
- **What it is:** a file Claude reads at the start of every session. It's the onboarding doc for your AI teammate.
- **Hierarchy:** `~/.claude/CLAUDE.md` (personal, all projects) → `./CLAUDE.md` (team, committed) → `web/CLAUDE.md` (loaded when working in that folder) → `CLAUDE.local.md` (personal, gitignored).
- **What should be in it:**
  - ✅ Commands (dev, test, single test, typecheck)
  - ✅ Architecture map: *where things go*
  - ✅ Non-obvious conventions ("no fetch in components", "filtering in repository")
  - ✅ Definition of done
  - ✅ Gotchas (in-memory DB, deterministic seed)
  - ✅ Pointers (`@docs/architecture.md`) instead of pasting whole docs
- **What should NOT be in it:** things the linter or types already enforce, generic advice ("write clean code"), long docs, secrets, or anything that changes weekly.
- **Rule of thumb:** keep it short. Every line costs context in every session. If Claude keeps making the same mistake, add one line. If a line never matters, delete it.
- Live: `/init` generates a first draft. `/memory` edits it.
- **Value add:** this is where most of Run B's prompt lives permanently, so the whole team gets the 4D Description step for free.

## 4. Context management (6 min)
- **Mental model:** the context window is Claude's working memory. Everything costs space: files read, tool output, your chat. When it fills, quality drops and older details get summarized.
- Show `/context` (what's using space).
- **Habits:**
  - `/clear` between unrelated tasks. A new task gets a fresh context.
  - `/compact focus on the filter feature` to summarize and keep going on long tasks.
  - Point at files (`@web/src/pages/TicketsPage.tsx`) instead of making Claude search.
  - Push big reads into a **subagent** (section 6). Only its summary comes back.
  - **Skills** load their full instructions only when triggered. Until then, just the one-line description sits in context.
  - Plan mode → approve → implement keeps exploration from polluting the build phase.
  - Esc Esc / `/rewind` to back out of a bad direction instead of arguing with it.
- **Value add:** long sessions stay as sharp as short ones, and you avoid the drift where Claude "forgets" a convention 40 minutes in.

## 5. Skills (5 min): package a team workflow
Open `.claude/skills/add-api-endpoint/SKILL.md` and `template.md`.
- **What:** a folder with instructions (+ optional templates/scripts) that Claude loads **automatically when the task matches the description**, or when you call `/add-api-endpoint`.
- **When to use one:** a multi-step procedure you do repeatedly with house rules. "We always do X, then Y, with this template."
  - Examples: add an endpoint, write release notes (`.claude/skills/release-notes`), DB migrations, incident write-ups.
- **vs CLAUDE.md:** CLAUDE.md = always-true facts (always loaded). Skill = a how-to for a specific task (loaded on demand).
- **Demo:** `add an "assignee" filter to the tickets API`. Watch Claude pick up the skill on its own and follow all 8 steps, including tests and the web client.
- Second demo: `/release-notes`. It turns the commits into a CHANGELOG entry plus a Slack summary.
- **Value add:** turns tribal knowledge into a shared, versioned, reviewable workflow. A new engineer gets the senior's checklist on day one.

## 6. Subagents (5 min): delegate side-work with a clean context
Open `.claude/agents/code-reviewer.md` and `a11y-auditor.md`.
- **What:** a separate Claude instance with its **own context window, own tool permissions and own model**. It does a job and returns only a summary.
- **When to use one:**
  - Work that reads a lot but should return a little (reviews, codebase research, log digging)
  - Work that should be **restricted** (reviewer has no Edit tool, so it can't "fix" things behind your back)
  - Work that can run **in parallel** (review + a11y audit at the same time)
  - A cheaper model for simpler jobs (`a11y-auditor` runs on Haiku)
- **Demo (strong closer):** check out `demo/without-4d` and say:
  `use the code-reviewer subagent to review this branch`
  → it should flag client-side filtering, wrong pagination, no tests, inline styles and missing labels, then return **Don't ship**.
  "The same Claude that wrote the bug catches it, *if you ask in the right way*. That's Discernment, automated."
- **Skill vs subagent, in one line:** a skill teaches Claude *how* to do a task in your conversation. A subagent *hands the task off* to a separate worker.

## 7. Wrap-up (2 min)
| Need | Use |
|---|---|
| Facts that are always true about the repo | **CLAUDE.md** |
| A repeatable procedure with house rules | **Skill** |
| Heavy, parallel, or restricted side-work | **Subagent** |
| Getting a good result on *this* task | **4D**: plan, describe, review, own |
| Long or multi-task sessions | `/clear`, `/compact`, `/context`, plan mode |

- Close: "The model is the same in both runs. The difference was 2 minutes of Description and one review step. CLAUDE.md, skills and subagents make that difference the team's default instead of an individual's discipline."
- **Call to action:** add a CLAUDE.md to one repo this week. Write down the workflow you repeat most and turn it into a skill.

---

## Q&A prep
- **"Does Claude always read CLAUDE.md?"** Yes, at session start. Nested ones load when Claude works in that directory.
- **"Skills vs slash commands?"** Skills can be invoked as `/name` *and* auto-trigger from their description. The description field is what makes them trigger, so write it well.
- **"Will a subagent's work show up in my context?"** Only its final report does. That's the point.
- **"Security?"** `.claude/settings.json` allows safe commands (test/typecheck/git diff), denies reading `.env` and force-pushes. Committed, so the whole team shares it.
- **"Was Run A staged?"** Both branches are reference outputs so the demo is deterministic. Run the 6-word prompt live on `baseline` if you want; the specifics vary, but the pattern (page-only filtering, no tests) is typical.

## Demo checklist (before going on stage)
```bash
npm install && npm test             # all green
./demo/side-by-side.sh              # :5174 = A, :5175 = B
git checkout main                   # for the skills/subagent part
```
- Have `demo/COMPARISON.md` and both screenshots open in tabs as a fallback if live fails.
