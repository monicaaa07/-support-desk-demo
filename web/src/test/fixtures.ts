import type { Page, Ticket } from '../api/types';

export function makeTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: 'TCK-1001',
    subject: 'Cannot reset password',
    description: 'desc',
    customer: { name: 'Priya Shah', email: 'priya@northwind.io', plan: 'enterprise' },
    status: 'open',
    priority: 'high',
    assignee: 'Jordan',
    tags: ['auth'],
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-01T09:00:00.000Z',
    ...overrides,
  };
}

export function makePage(items: Ticket[], total = items.length): Page<Ticket> {
  return { items, page: 1, pageSize: 20, total };
}

/** Stub global fetch with a handler; returns the mock so tests can assert on URLs. */
export function mockFetch(handler: (url: string) => unknown) {
  const fn = vi.fn(async (url: string) => new Response(JSON.stringify(handler(url)), { status: 200 }));
  vi.stubGlobal('fetch', fn);
  return fn;
}
