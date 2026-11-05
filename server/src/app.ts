import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { requestId } from './middleware/requestId.js';
import { createTicketRepository, type TicketRepository } from './modules/tickets/ticket.repository.js';
import { ticketRouter } from './modules/tickets/ticket.routes.js';
import { createTicketService } from './modules/tickets/ticket.service.js';

export function createApp(deps: { ticketRepo?: TicketRepository } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.use(requestId);

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  const tickets = createTicketService(deps.ticketRepo ?? createTicketRepository());
  app.use('/api/tickets', ticketRouter(tickets));

  app.use(errorHandler);
  return app;
}
