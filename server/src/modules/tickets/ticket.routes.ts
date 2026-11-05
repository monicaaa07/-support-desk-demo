import { Router } from 'express';
import { validate } from '../../lib/validate.js';
import { listTicketsQuery, updateTicketBody } from './ticket.schema.js';
import type { TicketService } from './ticket.service.js';

// Routes stay thin: validate input -> call service -> send JSON. No business logic here.
export function ticketRouter(service: TicketService) {
  const r = Router();

  r.get('/', (req, res) => {
    res.json(service.list(validate(listTicketsQuery, req.query)));
  });

  r.get('/stats', (_req, res) => {
    res.json(service.stats());
  });

  r.get('/:id', (req, res) => {
    res.json(service.get(req.params.id));
  });

  r.patch('/:id', (req, res) => {
    res.json(service.update(req.params.id, validate(updateTicketBody, req.body)));
  });

  return r;
}
