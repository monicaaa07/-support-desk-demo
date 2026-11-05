# web/ — UI rules (loaded when Claude works in this folder)

- Component = `Thing.tsx` + `Thing.module.css`. Reuse `Button`, `Badge`, `States` before writing new ones.
- List pages: anything a user would want to bookmark or share (page, filters, sort) belongs in the URL via `useSearchParams`.
- Tests: query by role/label (`getByRole`, `getByLabelText`), not test IDs, unless there's no accessible handle.
- Use `mockFetch` / `makeTicket` from `src/test/fixtures.ts` instead of hand-rolled mocks.
