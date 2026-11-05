import { Link } from 'react-router-dom';
import { ticketsApi } from '../api/tickets';
import { TICKET_STATUSES } from '../api/types';
import { ErrorState, LoadingState } from '../components/States';
import { useAsync } from '../hooks/useAsync';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const stats = useAsync(() => ticketsApi.stats(), []);
  if (stats.status === 'error') return <ErrorState error={stats.error} onRetry={stats.reload} />;
  if (!stats.data) return <LoadingState />;
  const data = stats.data;

  return (
    <section>
      <h1>Dashboard</h1>
      <div className={styles.grid}>
        <div className={`${styles.tile} ${styles.alert}`}>
          <span className={styles.value}>{data.urgentOpen}</span>
          <span className={styles.label}>Urgent & unresolved</span>
        </div>
        {TICKET_STATUSES.map((s) => (
          <div key={s} className={styles.tile}>
            <span className={styles.value}>{data.byStatus[s]}</span>
            <span className={styles.label}>{s}</span>
          </div>
        ))}
      </div>
      <p><Link to="/tickets">View all {data.total} tickets →</Link></p>
    </section>
  );
}
