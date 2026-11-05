import styles from './States.module.css';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className={styles.box} role="status" aria-live="polite">
      {label}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className={`${styles.box} ${styles.error}`} role="alert">
      <p>Couldn’t load data: {error.message}</p>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className={styles.box}>
      <p className={styles.title}>{title}</p>
      {children}
    </div>
  );
}
