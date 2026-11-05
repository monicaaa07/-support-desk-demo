import { Button } from './Button';
import styles from './Pagination.module.css';

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button onClick={() => onChange(page - 1)} disabled={page <= 1}>
        Previous
      </Button>
      <span>
        Page {page} of {pages}
      </span>
      <Button onClick={() => onChange(page + 1)} disabled={page >= pages}>
        Next
      </Button>
    </nav>
  );
}
