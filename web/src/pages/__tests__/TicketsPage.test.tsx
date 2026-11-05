import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { makePage, makeTicket, mockFetch } from '../../test/fixtures';
import { TicketsPage } from '../TicketsPage';

afterEach(() => vi.unstubAllGlobals());

let currentSearch = '';
function LocationSpy() {
  currentSearch = useLocation().search;
  return null;
}

function renderAt(url = '/tickets') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/tickets" element={<><TicketsPage /><LocationSpy /></>} />
      </Routes>
    </MemoryRouter>,
  );
}

it('renders tickets from the API', async () => {
  mockFetch(() => makePage([makeTicket()], 1));
  renderAt();
  expect(await screen.findByText('Cannot reset password')).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('1 ticket');
});

it('requests the next page and keeps it in the URL', async () => {
  const fetch = mockFetch(() => makePage([makeTicket()], 45));
  renderAt();
  await userEvent.click(await screen.findByRole('button', { name: 'Next' }));
  expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining('page=2'), expect.anything());
  expect(currentSearch).toContain('page=2');
});

it('restores filters from the URL on load (shareable link)', async () => {
  const fetch = mockFetch(() => makePage([makeTicket()], 1));
  renderAt('/tickets?status=open,pending&priority=urgent&q=sso');
  await screen.findByText('Cannot reset password');
  const url = decodeURIComponent(fetch.mock.calls[0][0] as string);
  expect(url).toContain('status=open,pending');
  expect(url).toContain('priority=urgent');
  expect(url).toContain('q=sso');
  expect(screen.getByRole('button', { name: 'open' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByLabelText('Search')).toHaveValue('sso');
});

it('toggling a status filter queries the server and resets to page 1', async () => {
  const fetch = mockFetch(() => makePage([makeTicket()], 45));
  renderAt('/tickets?page=3');
  await userEvent.click(await screen.findByRole('button', { name: 'urgent' }));
  await waitFor(() =>
    expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining('priority=urgent'), expect.anything()),
  );
  expect(currentSearch).not.toContain('page=');
});

it('debounces search input into a single request', async () => {
  const fetch = mockFetch(() => makePage([makeTicket()], 1));
  renderAt();
  await screen.findByText('Cannot reset password');
  const before = fetch.mock.calls.length;
  await userEvent.type(screen.getByLabelText('Search'), 'invoice');
  await waitFor(() => expect(currentSearch).toContain('q=invoice'));
  const searchCalls = fetch.mock.calls.slice(before).filter(([u]) => String(u).includes('q='));
  expect(searchCalls).toHaveLength(1);
});

it('shows a filtered empty state with a way out', async () => {
  mockFetch(() => makePage([], 0));
  renderAt('/tickets?q=nothing');
  expect(await screen.findByText('No tickets match these filters')).toBeInTheDocument();
  await userEvent.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]);
  await waitFor(() => expect(currentSearch).toBe(''));
});

it('ignores unknown values in a hand-edited URL', async () => {
  const fetch = mockFetch(() => makePage([makeTicket()], 1));
  renderAt('/tickets?status=banana');
  await screen.findByText('Cannot reset password');
  expect(fetch.mock.calls[0][0]).not.toContain('status=');
});
