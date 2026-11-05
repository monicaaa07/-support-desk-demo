import { useCallback, useEffect, useState } from 'react';

export type AsyncState<T> =
  | { status: 'loading'; data?: T }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error; data?: T };

/**
 * Standard data-loading hook. Every page uses this so loading / error / success
 * states look and behave the same everywhere. Re-runs when `deps` change and
 * ignores stale responses (prevents out-of-order results).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ status: 'loading', data: s.data }));
    fn().then(
      (data) => !cancelled && setState({ status: 'success', data }),
      (error: Error) => !cancelled && setState((s) => ({ status: 'error', error, data: s.data })),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, reload };
}
