import { z } from 'zod';
import { config } from '../../config.js';
import { TICKET_PRIORITIES, TICKET_STATUSES } from './ticket.types.js';

export const listTicketsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(config.maxPageSize).default(20),
});
export type ListTicketsQuery = z.infer<typeof listTicketsQuery>;

export const updateTicketBody = z
  .object({
    status: z.enum(TICKET_STATUSES).optional(),
    priority: z.enum(TICKET_PRIORITIES).optional(),
    assignee: z.string().min(1).nullable().optional(),
  })
  .strict()
  .refine((b) => Object.keys(b).length > 0, { message: 'At least one field is required' });
export type UpdateTicketBody = z.infer<typeof updateTicketBody>;
