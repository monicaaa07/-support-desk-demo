const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function formatRelative(iso: string, now = Date.now()): string {
  const diffMs = new Date(iso).getTime() - now;
  const days = Math.round(diffMs / 86_400_000);
  if (Math.abs(days) >= 1) return rtf.format(days, 'day');
  const hours = Math.round(diffMs / 3_600_000);
  return rtf.format(hours, 'hour');
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' });
}
