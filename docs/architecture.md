# Architecture

```
Browser ──► web (React, Vite :5173) ──/api proxy──► server (Express :4000)
                                                     ├─ middleware: requestId, json, errorHandler
                                                     └─ modules/tickets: routes → service → repository
```

- **Request flow:** route validates with zod → service applies business rules → repository reads/writes storage.
- **Storage:** in-memory today (ADR-0001). Repository interface is the seam for Postgres.
- **Error contract:** `{ error: { code, message, details? } }` with proper HTTP status.
- **UI data flow:** page → `useAsync(() => ticketsApi.x())` → renders Loading / Error / Empty / data.
