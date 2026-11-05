import { useEffect, useId, useState } from 'react';
import { TICKET_PRIORITIES, TICKET_STATUSES, type TicketPriority, type TicketStatus } from '../api/types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { Button } from './Button';
import styles from './TicketFilters.module.css';

interface Props {
  status: TicketStatus[];
  priority: TicketPriority[];
  q: string;
  isFiltered: boolean;
  onChange: (patch: { status?: TicketStatus[]; priority?: TicketPriority[]; q?: string }) => void;
  onClear: () => void;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function ChipGroup<T extends string>(props: {
  legend: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{props.legend}</legend>
      {props.options.map((opt) => {
        const on = props.selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={on}
            className={`${styles.chip} ${on ? styles.chipOn : ''}`}
            onClick={() => props.onToggle(opt)}
          >
            {opt}
          </button>
        );
      })}
    </fieldset>
  );
}

export function TicketFilters({ status, priority, q, isFiltered, onChange, onClear }: Props) {
  const searchId = useId();
  // Local input state keeps typing instant; the URL/API update is debounced.
  const [draft, setDraft] = useState(q);
  const debounced = useDebouncedValue(draft, 300);

  useEffect(() => {
    if (debounced !== q) onChange({ q: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Keep the box in sync when the URL changes from outside (Back button, Clear).
  useEffect(() => setDraft(q), [q]);

  return (
    <div className={styles.bar} role="search">
      <div className={styles.search}>
        <label htmlFor={searchId} className={styles.legend}>
          Search
        </label>
        <input
          id={searchId}
          type="search"
          value={draft}
          maxLength={100}
          placeholder="Subject, customer, email or ticket ID"
          onChange={(e) => setDraft(e.target.value)}
          className={styles.input}
        />
      </div>
      <ChipGroup
        legend="Status"
        options={TICKET_STATUSES}
        selected={status}
        onToggle={(v) => onChange({ status: toggle(status, v) })}
      />
      <ChipGroup
        legend="Priority"
        options={TICKET_PRIORITIES}
        selected={priority}
        onToggle={(v) => onChange({ priority: toggle(priority, v) })}
      />
      {isFiltered && (
        <Button variant="ghost" onClick={onClear} className={styles.clear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
