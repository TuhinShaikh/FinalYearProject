import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWidget from '../../components/ChatWidget';

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { stopPoints: [] } }),
  },
}));

describe('ChatWidget', () => {
  it('can send quick prompt and return contextual answer', async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole('button', { name: 'Where do I book parking?' }));

    await waitFor(() => {
      expect(screen.getByText(/Book Parking page is linked/i)).toBeInTheDocument();
    }, { timeout: 12000 });
  }, 15000);
});
