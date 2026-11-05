import { seedTickets } from '../../data/seed.js';
import type { Page, Ticket } from './ticket.types.js';

/**
 * In-memory repository. In production this is backed by Postgres; the interface
 * is what the service layer depends on, so swapping storage does not touch routes.
 */
export interface TicketRepository {
  list(opts: { page: number; pageSize: number }): Page<Ticket>;
  get(id: string): Ticket | undefined;
  update(id: string, patch: Partial<Ticket>): Ticket | undefined;
  all(): Ticket[];
}

export function createTicketRepository(initial: Ticket[] = seedTickets()): TicketRepository {
  const rows = new Map(initial.map((t) => [t.id, structuredClone(t)]));

  const sorted = () =>
    [...rows.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    list({ page, pageSize }) {
      const all = sorted();
      const start = (page - 1) * pageSize;
      return { items: all.slice(start, start + pageSize), page, pageSize, total: all.length };
    },
    get: (id) => rows.get(id),
    update(id, patch) {
      const current = rows.get(id);
      if (!current) return undefined;
      const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
      rows.set(id, next);
      return next;
    },
    all: () => sorted(),
  };
}
