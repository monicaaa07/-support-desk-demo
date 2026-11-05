import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import type { Ticket } from '../src/modules/tickets/ticket.types.js';

const get = (qs: string) => request(createApp()).get(`/api/tickets${qs}`);

describe('GET /api/tickets filters', () => {
  it('filters by a single status and reports the filtered total', async () => {
    const res = await get('?status=pending&pageSize=100');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items.every((t: Ticket) => t.status === 'pending')).toBe(true);
    expect(res.body.total).toBe(res.body.items.length);
  });

  it('accepts multiple statuses as a comma-separated list', async () => {
    const res = await get('?status=open,pending&pageSize=100');
    const statuses = new Set(res.body.items.map((t: Ticket) => t.status));
    expect([...statuses].sort()).toEqual(['open', 'pending']);
  });

  it('combines status, priority and search (AND)', async () => {
    const res = await get('?status=open&priority=urgent,high&q=priya&pageSize=100');
    for (const t of res.body.items as Ticket[]) {
      expect(t.status).toBe('open');
      expect(['urgent', 'high']).toContain(t.priority);
      expect(`${t.customer.name} ${t.customer.email}`.toLowerCase()).toContain('priya');
    }
  });

  it('searches subject case-insensitively and by ticket id', async () => {
    const bySubject = await get('?q=PASSWORD');
    expect(bySubject.body.total).toBeGreaterThan(0);
    const byId = await get('?q=tck-1001');
    expect(byId.body.items.map((t: Ticket) => t.id)).toContain('TCK-1001');
  });

  it('paginates over the filtered set, not the whole table', async () => {
    const all = await get('?status=open&pageSize=100');
    const page2 = await get('?status=open&pageSize=5&page=2');
    expect(page2.body.total).toBe(all.body.total);
    expect(page2.body.items.map((t: Ticket) => t.id)).toEqual(
      all.body.items.slice(5, 10).map((t: Ticket) => t.id),
    );
  });

  it('returns an empty page (not an error) when nothing matches', async () => {
    const res = await get('?q=zzz-no-such-ticket');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ items: [], total: 0 });
  });

  it('rejects an unknown status with a 400', async () => {
    const res = await get('?status=open,banana');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects an overly long search term', async () => {
    const res = await get(`?q=${'a'.repeat(101)}`);
    expect(res.status).toBe(400);
  });
});
