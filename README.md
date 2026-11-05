# Support Desk

Internal console for triaging customer support tickets. API (`server/`) + web UI (`web/`).

```bash
nvm use            # Node 22
npm install
npm run dev        # http://localhost:5173
npm test
```

| Path | What |
|---|---|
| `server/src/modules/tickets` | Ticket API (routes → service → repository) |
| `web/src/pages` | Dashboard, Tickets list, Ticket detail |
| `docs/` | Architecture + ADRs |
| `CLAUDE.md`, `.claude/` | Claude Code project memory, skills, subagents, permissions |
| `demo/` | Presentation material: prompts, comparison, talking points |
