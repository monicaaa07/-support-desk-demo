# Snippets

## Comma-separated enum list in a query string
```ts
const csvEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .string()
    .transform((s) => s.split(',').map((v) => v.trim()).filter(Boolean))
    .pipe(z.array(z.enum(values)));

export const listThingsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  status: csvEnum(STATUSES).optional(),
  q: z.string().trim().max(100).optional(),
});
```

## Supertest
```ts
it('rejects an unknown status', async () => {
  const res = await request(createApp()).get('/api/things?status=nope');
  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
});
```
