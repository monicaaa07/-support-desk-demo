import { ticketsApi } from '../api/tickets';
import { Button } from '../components/Button';
import { Pagination } from '../components/Pagination';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { TicketFilters } from '../components/TicketFilters';
import { TicketTable } from '../components/TicketTable';
import { useAsync } from '../hooks/useAsync';
import { useTicketFilters } from '../hooks/useTicketFilters';
import styles from './TicketsPage.module.css';

const PAGE_SIZE = 20;

export function TicketsPage() {
  const filters = useTicketFilters();
  const { page, status, priority, q } = filters;

  const result = useAsync(
    () => ticketsApi.list({ page, pageSize: PAGE_SIZE, status, priority, q }),
    [page, status.join(), priority.join(), q],
  );
  const data = result.data;

  return (
    <section>
      <h1>Tickets</h1>
      <TicketFilters
        status={status}
        priority={priority}
        q={q}
        isFiltered={filters.isFiltered}
        onChange={filters.update}
        onClear={filters.clear}
      />

      <p className={styles.count} role="status" aria-live="polite">
        {data && `${data.total} ${data.total === 1 ? 'ticket' : 'tickets'}${filters.isFiltered ? ' match your filters' : ''}`}
      </p>

      {result.status === 'error' && <ErrorState error={result.error} onRetry={result.reload} />}
      {result.status === 'loading' && !data && <LoadingState />}
      {data && data.items.length === 0 &&
        (filters.isFiltered ? (
          <EmptyState title="No tickets match these filters">
            <Button onClick={filters.clear}>Clear filters</Button>
          </EmptyState>
        ) : (
          <EmptyState title="No tickets yet" />
        ))}
      {data && data.items.length > 0 && (
        <div className={result.status === 'loading' ? styles.stale : undefined} aria-busy={result.status === 'loading'}>
          <TicketTable tickets={data.items} />
          <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onChange={(p) => filters.update({ page: p })} />
        </div>
      )}
    </section>
  );
}
