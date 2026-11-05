import { useState } from 'react';
import { ticketsApi } from '../api/tickets';
import { Pagination } from '../components/Pagination';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { TicketTable } from '../components/TicketTable';
import { useAsync } from '../hooks/useAsync';

const PAGE_SIZE = 20;

export function TicketsPage() {
  const [page, setPage] = useState(1);
  const result = useAsync(() => ticketsApi.list({ page, pageSize: PAGE_SIZE }), [page]);

  return (
    <section>
      <h1>Tickets</h1>
      {result.status === 'error' && <ErrorState error={result.error} onRetry={result.reload} />}
      {result.status === 'loading' && !result.data && <LoadingState />}
      {result.data && result.data.items.length === 0 && <EmptyState title="No tickets yet" />}
      {result.data && result.data.items.length > 0 && (
        <>
          <TicketTable tickets={result.data.items} />
          <Pagination page={page} pageSize={PAGE_SIZE} total={result.data.total} onChange={setPage} />
        </>
      )}
    </section>
  );
}
