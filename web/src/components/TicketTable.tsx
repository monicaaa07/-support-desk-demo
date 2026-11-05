import { Link } from 'react-router-dom';
import type { Ticket } from '../api/types';
import { formatRelative } from '../lib/format';
import { Badge } from './Badge';
import styles from './TicketTable.module.css';

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Subject</th>
          <th scope="col">Customer</th>
          <th scope="col">Status</th>
          <th scope="col">Priority</th>
          <th scope="col">Assignee</th>
          <th scope="col">Created</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td className={styles.mono}>{t.id}</td>
            <td>
              <Link to={`/tickets/${t.id}`}>{t.subject}</Link>
            </td>
            <td>
              {t.customer.name}
              <span className={styles.muted}> · {t.customer.plan}</span>
            </td>
            <td><Badge kind="status" value={t.status} /></td>
            <td><Badge kind="priority" value={t.priority} /></td>
            <td>{t.assignee ?? <span className={styles.muted}>Unassigned</span>}</td>
            <td className={styles.muted}>{formatRelative(t.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
