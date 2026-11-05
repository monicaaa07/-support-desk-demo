import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const app = () => createApp();

describe('GET /api/tickets', () => {
  it('returns the first page newest-first', async () => {
    const res = await request(app()).get('/api/tickets');
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.items).toHaveLength(20);
    expect(res.body.total).toBe(64);
    const dates = res.body.items.map((t: { createdAt: string }) => t.createdAt);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it('paginates', async () => {
    const res = await request(app()).get('/api/tickets?page=4&pageSize=20');
    expect(res.body.items).toHaveLength(4);
  });

  it('rejects an oversized pageSize with a 400', async () => {
    const res = await request(app()).get('/api/tickets?pageSize=5000');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/tickets/:id', () => {
  it('returns a ticket', async () => {
    const res = await request(app()).get('/api/tickets/TCK-1001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('TCK-1001');
  });

  it('404s for an unknown ticket', async () => {
    const res = await request(app()).get('/api/tickets/TCK-0');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('PATCH /api/tickets/:id', () => {
  it('updates status', async () => {
    const a = app();
    const res = await request(a).patch('/api/tickets/TCK-1001').send({ status: 'resolved' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('resolved');
  });

  it('rejects unknown fields', async () => {
    const res = await request(app()).patch('/api/tickets/TCK-1001').send({ hacked: true });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/tickets/stats', () => {
  it('counts by status', async () => {
    const res = await request(app()).get('/api/tickets/stats');
    expect(res.body.total).toBe(64);
    const sum = Object.values(res.body.byStatus as Record<string, number>).reduce((a, b) => a + b, 0);
    expect(sum).toBe(64);
  });
});
