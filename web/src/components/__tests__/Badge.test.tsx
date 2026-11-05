import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

it('renders the value with a kind-specific class', () => {
  render(<Badge kind="priority" value="urgent" />);
  const el = screen.getByTestId('priority-badge');
  expect(el).toHaveTextContent('urgent');
  expect(el.className).toContain('priority-urgent');
});
