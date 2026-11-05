import { apiFetch } from './client';
import type { Page, Ticket, TicketStats } from './types';

export interface ListTicketsParams {
  page?: number;
  pageSize?: number;
}

function toQuery(params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') qs.set(k, String(v));
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export const ticketsApi = {
  list: (params: ListTicketsParams = {}) =>
    apiFetch<Page<Ticket>>(`/tickets${toQuery({ ...params })}`),
  get: (id: string) => apiFetch<Ticket>(`/tickets/${encodeURIComponent(id)}`),
  update: (id: string, patch: Partial<Pick<Ticket, 'status' | 'priority' | 'assignee'>>) =>
    apiFetch<Ticket>(`/tickets/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  stats: () => apiFetch<TicketStats>('/tickets/stats'),
};
