import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TICKET_PRIORITIES, TICKET_STATUSES, type TicketPriority, type TicketStatus } from '../api/types';

export interface TicketFilterState {
  page: number;
  status: TicketStatus[];
  priority: TicketPriority[];
  q: string;
}

const parseList = <T extends string>(raw: string | null, allowed: readonly T[]): T[] =>
  (raw ?? '').split(',').filter((v): v is T => (allowed as readonly string[]).includes(v));

/**
 * The URL is the source of truth for list state, so filtered views can be
 * bookmarked, shared in Slack, and survive a refresh. Unknown values in a
 * hand-edited URL are dropped instead of crashing the page.
 */
export function useTicketFilters() {
  const [params, setParams] = useSearchParams();

  const state: TicketFilterState = useMemo(
    () => ({
      page: Math.max(1, Number(params.get('page')) || 1),
      status: parseList(params.get('status'), TICKET_STATUSES),
      priority: parseList(params.get('priority'), TICKET_PRIORITIES),
      q: params.get('q') ?? '',
    }),
    [params],
  );

  const update = useCallback(
    (patch: Partial<TicketFilterState>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const merged = { ...state, ...patch };
          // Any filter change sends the user back to page 1.
          if (!('page' in patch)) merged.page = 1;
          const set = (k: string, v: string) => (v ? next.set(k, v) : next.delete(k));
          set('status', merged.status.join(','));
          set('priority', merged.priority.join(','));
          set('q', merged.q.trim());
          set('page', merged.page > 1 ? String(merged.page) : '');
          return next;
        },
        { replace: 'q' in patch },
      );
    },
    [setParams, state],
  );

  const clear = useCallback(() => setParams({}), [setParams]);
  const isFiltered = state.status.length > 0 || state.priority.length > 0 || state.q !== '';

  return { ...state, update, clear, isFiltered };
}
