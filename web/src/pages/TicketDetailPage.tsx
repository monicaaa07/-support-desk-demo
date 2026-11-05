import { Link, useParams } from 'react-router-dom';
import { ticketsApi } from '../api/tickets';
import { TICKET_STATUSES, type TicketStatus } from '../api/types';
import { Badge } from '../components/Badge';
import { ErrorState, LoadingState } from '../components/States';
import { useAsync } from '../hooks/useAsync';
import { formatDateTime } from '../lib/format';
import styles from './TicketDetailPage.module.css';

export function TicketDetailPage() {
  const { id = '' } = useParams();
  const result = useAsync(() => ticketsApi.get(id), [id]);

  if (result.status === 'error') return <ErrorState error={result.error} onRetry={result.reload} />;
  if (!result.data) return <LoadingState />;
  const t = result.data;

  async function changeStatus(status: TicketStatus) {
    await ticketsApi.update(t.id, { status });
    result.reload();
  }

  return (
    <article className={styles.card}>
      <Link to="/tickets">← All tickets</Link>
      <h1>
        {t.subject} <span className={styles.id}>{t.id}</span>
      </h1>
      <div className={styles.meta}>
        <Badge kind="status" value={t.status} />
        <Badge kind="priority" value={t.priority} />
        <span>{t.customer.name} ({t.customer.email}) · {t.customer.plan}</span>
        <span>Opened {formatDateTime(t.createdAt)}</span>
      </div>
      <p>{t.description}</p>
      <label>
        Status{' '}
        <select value={t.status} onChange={(e) => changeStatus(e.target.value as TicketStatus)}>
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
    </article>
  );
}
