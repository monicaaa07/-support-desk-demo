import { apiFetch } from './client';
import type { Page, Ticket, TicketPriority, TicketStats, TicketStatus } from './types';

export interface ListTicketsParams {
  page?: number;
  pageSize?: number;
  status?: TicketStatus[];
  priority?: TicketPriority[];
  q?: string;
}

function toQuery(params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') qs.set(k, String(v));
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export const ticketsApi = {
  list: ({ status, priority, ...rest }: ListTicketsParams = {}) =>
    apiFetch<Page<Ticket>>(
      `/tickets${toQuery({ ...rest, status: status?.join(','), priority: priority?.join(',') })}`,
    ),
  get: (id: string) => apiFetch<Ticket>(`/tickets/${encodeURIComponent(id)}`),
  update: (id: string, patch: Partial<Pick<Ticket, 'status' | 'priority' | 'assignee'>>) =>
    apiFetch<Ticket>(`/tickets/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  stats: () => apiFetch<TicketStats>('/tickets/stats'),
};
