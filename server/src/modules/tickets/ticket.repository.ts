import { seedTickets } from '../../data/seed.js';
import type { Page, Ticket, TicketPriority, TicketStatus } from './ticket.types.js';

export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  /** Case-insensitive match on id, subject, customer name or email. */
  q?: string;
}

/**
 * In-memory repository. In production this is backed by Postgres; the interface
 * is what the service layer depends on, so swapping storage does not touch routes.
 */
export interface TicketRepository {
  list(opts: { page: number; pageSize: number } & TicketFilters): Page<Ticket>;
  get(id: string): Ticket | undefined;
  update(id: string, patch: Partial<Ticket>): Ticket | undefined;
  all(): Ticket[];
}

function matches(t: Ticket, f: TicketFilters): boolean {
  if (f.status?.length && !f.status.includes(t.status)) return false;
  if (f.priority?.length && !f.priority.includes(t.priority)) return false;
  if (f.q) {
    const needle = f.q.toLowerCase();
    const haystack = [t.id, t.subject, t.customer.name, t.customer.email].join(' ').toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function createTicketRepository(initial: Ticket[] = seedTickets()): TicketRepository {
  const rows = new Map(initial.map((t) => [t.id, structuredClone(t)]));

  const sorted = () =>
    [...rows.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    list({ page, pageSize, ...filters }) {
      const all = sorted().filter((t) => matches(t, filters));
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
