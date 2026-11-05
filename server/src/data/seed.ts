import type { Ticket, TicketPriority, TicketStatus } from '../modules/tickets/ticket.types.js';

// Deterministic fake data so screenshots, tests and demos are reproducible.
const subjects = [
  'Cannot reset password', 'Invoice shows wrong VAT', 'SSO login loops back to sign-in',
  'Export to CSV times out', 'Webhook deliveries failing with 502', 'Request to upgrade plan',
  'Dashboard charts not loading', 'API rate limit too low for our usage', 'Duplicate charge on card',
  'Need audit log for compliance review', 'Mobile app crashes on launch', 'Email notifications delayed',
  'Add teammate to workspace', 'Data residency question (EU)', 'Bulk import skipped rows',
  'Cancel subscription', 'Two-factor codes not arriving', 'Search returns stale results',
];
const customers = [
  ['Priya Shah', 'priya@northwind.io', 'enterprise'], ['Marcus Lee', 'marcus@globex.com', 'pro'],
  ['Ana Souza', 'ana@initech.dev', 'free'], ['Tom Becker', 'tom@umbrella.co', 'enterprise'],
  ['Yuki Tanaka', 'yuki@hooli.com', 'pro'], ['Fatima Noor', 'fatima@acme.org', 'pro'],
  ['Liam O\'Brien', 'liam@stark.ie', 'free'], ['Chen Wei', 'chen@wayne.cn', 'enterprise'],
] as const;
const statuses: TicketStatus[] = ['open', 'open', 'pending', 'resolved', 'closed', 'open'];
const priorities: TicketPriority[] = ['low', 'medium', 'medium', 'high', 'urgent', 'low', 'high'];
const agents = ['Jordan', 'Sam', 'Riley', null];
const tagPool = ['billing', 'auth', 'api', 'bug', 'feature-request', 'mobile', 'enterprise', 'data'];

export function seedTickets(count = 64): Ticket[] {
  const base = Date.UTC(2026, 9, 1, 9, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const [name, email, plan] = customers[i % customers.length];
    const created = new Date(base + i * 7.3 * 3600_000).toISOString();
    return {
      id: `TCK-${String(1001 + i)}`,
      subject: subjects[(i * 5) % subjects.length],
      description: `Customer reports: "${subjects[(i * 5) % subjects.length]}". Repro steps attached in thread.`,
      customer: { name, email, plan },
      status: statuses[(i * 7) % statuses.length],
      priority: priorities[(i * 3) % priorities.length],
      assignee: agents[i % agents.length],
      tags: [tagPool[i % tagPool.length], tagPool[(i * 3 + 1) % tagPool.length]].filter((t, j, a) => a.indexOf(t) === j),
      createdAt: created,
      updatedAt: created,
    };
  });
}
