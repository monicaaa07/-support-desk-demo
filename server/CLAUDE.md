# server/ — API rules (loaded when Claude works in this folder)

- Every request input (query, params, body) is parsed with a zod schema via `validate()`. Invalid → 400 `VALIDATION_ERROR`.
- Filtering, sorting and pagination happen in the repository, never in the route or the client.
- List endpoints return `Page<T>` (`items, page, pageSize, total`). `total` is the count AFTER filters.
- Log with `logger` (structured JSON). Never log customer emails or ticket descriptions.
