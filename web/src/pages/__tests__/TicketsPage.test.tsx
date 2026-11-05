import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { makePage, makeTicket, mockFetch } from '../../test/fixtures';
import { TicketsPage } from '../TicketsPage';

afterEach(() => vi.unstubAllGlobals());

it('renders tickets from the API', async () => {
  mockFetch(() => makePage([makeTicket()], 1));
  render(<MemoryRouter><TicketsPage /></MemoryRouter>);
  expect(await screen.findByText('Cannot reset password')).toBeInTheDocument();
});

it('requests the next page', async () => {
  const fetch = mockFetch(() => makePage([makeTicket()], 45));
  render(<MemoryRouter><TicketsPage /></MemoryRouter>);
  await userEvent.click(await screen.findByRole('button', { name: 'Next' }));
  expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining('page=2'), expect.anything());
});
