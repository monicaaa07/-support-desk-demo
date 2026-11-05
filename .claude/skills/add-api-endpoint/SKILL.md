---
name: add-api-endpoint
description: Add or extend an HTTP endpoint in server/ end-to-end (zod schema, repository, service, route, supertest tests, and the matching web/src/api client function). Use whenever the user asks for a new API route, a new query parameter or filter on an existing route, or a new field in a request/response.
---

# Add an API endpoint (Support Desk house workflow)

Follow these steps in order. Don't skip the tests or the web client step.

1. **Find the module.** `server/src/modules/<name>/`. If it doesn't exist, copy the shape of `tickets/`.
2. **Schema first.** Add/extend a zod schema in `<name>.schema.ts`.
   - Query strings arrive as strings: use `z.coerce.number()` and for multi-value enums accept comma-separated text (see `template.md`).
   - Use `.strict()` on bodies so unknown fields are rejected.
3. **Repository.** Filtering/sorting/pagination go here. `total` is counted AFTER filters.
4. **Service.** Business rules + `NotFoundError` etc. Log with `logger` — no PII.
5. **Route.** Thin: `res.json(service.x(validate(schema, req.query)))`.
6. **Tests** in `server/test/<name>.test.ts` with supertest. Minimum:
   - happy path, one filter combination, invalid input → 400 `VALIDATION_ERROR`, pagination `total` correctness.
7. **Web client.** Add/extend the function in `web/src/api/<name>.ts` and types in `web/src/api/types.ts`.
8. **Verify:** `npm run typecheck && npm test`. Paste the summary lines in your reply.

See `template.md` in this folder for copy-paste snippets.
