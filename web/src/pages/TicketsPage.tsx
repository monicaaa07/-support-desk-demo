import { useState } from 'react';
import { ticketsApi } from '../api/tickets';
import { Pagination } from '../components/Pagination';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { TicketTable } from '../components/TicketTable';
import { useAsync } from '../hooks/useAsync';

const PAGE_SIZE = 20;

export function TicketsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const result = useAsync(() => ticketsApi.list({ page, pageSize: PAGE_SIZE }), [page]);

  const filtered = (result.data?.items ?? []).filter((t) => {
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (status && t.status !== status) return false;
    if (priority && t.priority !== priority) return false;
    return true;
  });

  return (
    <section>
      <h1>Tickets</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 6, border: '1px solid #ccc', borderRadius: 4, width: 250 }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 6 }}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: 6 }}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      {result.status === 'error' && <ErrorState error={result.error} onRetry={result.reload} />}
      {result.status === 'loading' && !result.data && <LoadingState />}
      {result.data && filtered.length === 0 && <EmptyState title="No tickets yet" />}
      {result.data && filtered.length > 0 && (
        <>
          <TicketTable tickets={filtered} />
          <Pagination page={page} pageSize={PAGE_SIZE} total={result.data.total} onChange={setPage} />
        </>
      )}
    </section>
  );
}
