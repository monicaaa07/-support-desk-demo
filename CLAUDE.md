# Support Desk — Claude Code guide

Internal console our support team uses to triage customer tickets.
Monorepo: `server/` (Express + TypeScript API) and `web/` (React + Vite UI). npm workspaces.

## Commands
- `npm run dev` — API on :4000 + web on :5173 (Vite proxies `/api`)
- `npm test` — all tests (vitest). Single file: `npm test -w web -- TicketsPage`
- `npm run typecheck` — must pass before you say you're done
- `npm run build` — what CI runs last

## Architecture (where things go)
- API module = `server/src/modules/<name>/` → `*.types.ts`, `*.schema.ts` (zod), `*.repository.ts`, `*.service.ts`, `*.routes.ts`
- Routes are thin: `validate(schema, input)` → service → `res.json`. Business logic lives in services.
- Errors: throw `AppError` subclasses from `server/src/lib/errors.ts`. Never `res.status(500)` by hand.
- Web talks to the API ONLY through `web/src/api/*` (`apiFetch`). No `fetch()` in components.
- Data loading in pages uses `useAsync` (`web/src/hooks/useAsync.ts`) + `LoadingState` / `ErrorState` / `EmptyState`.
- Shared types are duplicated in `web/src/api/types.ts` — if you change a server type, update it there too.

## Conventions
- TypeScript strict. No `any`, no `@ts-ignore`.
- Styling: CSS Modules next to the component + tokens from `web/src/styles/tokens.css`. No inline styles, no hex colors in components.
- Accessibility: every form control has a visible or `visually-hidden` label; interactive things are real `<button>`/`<a>`.
- Every behavior change ships with tests (server: supertest in `server/test/`; web: Testing Library in `__tests__/`).
- Don't add dependencies without saying why in your summary.

## Definition of done
1. `npm run typecheck && npm test` pass
2. New behavior has tests (happy path + at least one edge case)
3. Summary lists what changed, why, and anything you were unsure about

## Gotchas
- The repository is in-memory (see `docs/adr/0001-in-memory-repository.md`); state resets on restart.
- Seed data is deterministic (`server/src/data/seed.ts`) — tests rely on 64 tickets. Don't change counts casually.
- `.env` is never read or edited by Claude; use `.env.example`.

## More context (read when relevant, not up front)
- Architecture overview: @docs/architecture.md
- UI rules: `web/CLAUDE.md` · API rules: `server/CLAUDE.md`
