import { NotFoundError } from '../../lib/errors.js';
import { logger } from '../../lib/logger.js';
import type { TicketRepository } from './ticket.repository.js';
import type { ListTicketsQuery, UpdateTicketBody } from './ticket.schema.js';
import { TICKET_STATUSES, type TicketStatus } from './ticket.types.js';

export function createTicketService(repo: TicketRepository) {
  return {
    list(query: ListTicketsQuery) {
      return repo.list(query);
    },

    get(id: string) {
      const ticket = repo.get(id);
      if (!ticket) throw new NotFoundError('Ticket', id);
      return ticket;
    },

    update(id: string, body: UpdateTicketBody) {
      const updated = repo.update(id, body);
      if (!updated) throw new NotFoundError('Ticket', id);
      logger.info('ticket_updated', { id, fields: Object.keys(body) });
      return updated;
    },

    stats() {
      const byStatus = Object.fromEntries(TICKET_STATUSES.map((s) => [s, 0])) as Record<TicketStatus, number>;
      let urgentOpen = 0;
      for (const t of repo.all()) {
        byStatus[t.status] += 1;
        if (t.priority === 'urgent' && t.status !== 'closed' && t.status !== 'resolved') urgentOpen += 1;
      }
      return { byStatus, urgentOpen, total: repo.all().length };
    },
  };
}
export type TicketService = ReturnType<typeof createTicketService>;
