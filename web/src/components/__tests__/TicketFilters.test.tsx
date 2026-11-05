import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TicketFilters } from '../TicketFilters';

const base = { status: [], priority: [], q: '', isFiltered: false, onClear: vi.fn() };

it('exposes accessible controls', () => {
  render(<TicketFilters {...base} onChange={vi.fn()} />);
  expect(screen.getByRole('search')).toBeInTheDocument();
  expect(screen.getByLabelText('Search')).toBeInTheDocument();
  expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument();
  expect(screen.getByRole('group', { name: 'Priority' })).toBeInTheDocument();
});

it('toggles a chip on and off', async () => {
  const onChange = vi.fn();
  const { rerender } = render(<TicketFilters {...base} onChange={onChange} />);
  await userEvent.click(screen.getByRole('button', { name: 'pending' }));
  expect(onChange).toHaveBeenLastCalledWith({ status: ['pending'] });

  rerender(<TicketFilters {...base} status={['pending']} isFiltered onChange={onChange} />);
  expect(screen.getByRole('button', { name: 'pending' })).toHaveAttribute('aria-pressed', 'true');
  await userEvent.click(screen.getByRole('button', { name: 'pending' }));
  expect(onChange).toHaveBeenLastCalledWith({ status: [] });
});

it('only shows Clear when something is filtered', () => {
  const { rerender } = render(<TicketFilters {...base} onChange={vi.fn()} />);
  expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  rerender(<TicketFilters {...base} isFiltered onChange={vi.fn()} />);
  expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
});
