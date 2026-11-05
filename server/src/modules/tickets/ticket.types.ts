export const TICKET_STATUSES = ['open', 'pending', 'resolved', 'closed'] as const;
export const TICKET_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  customer: { name: string; email: string; plan: 'free' | 'pro' | 'enterprise' };
  status: TicketStatus;
  priority: TicketPriority;
  assignee: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
