import type { TicketPriority, TicketStatus } from '../api/types';
import styles from './Badge.module.css';

type Props =
  | { kind: 'status'; value: TicketStatus }
  | { kind: 'priority'; value: TicketPriority };

export function Badge({ kind, value }: Props) {
  return (
    <span className={`${styles.badge} ${styles[`${kind}-${value}`]}`} data-testid={`${kind}-badge`}>
      {value}
    </span>
  );
}
