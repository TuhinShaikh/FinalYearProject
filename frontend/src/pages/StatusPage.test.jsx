import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import StatusPage from './StatusPage';

vi.mock('axios');
vi.mock('../components/TfLMap', () => ({
  default: () => <div data-testid="tfl-map">TfLMap</div>,
}));

// We mock TfL and map internals here so the page behavior is validated without network/map flakiness.
describe('StatusPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tube status and allows map toggle', async () => {
    const user = userEvent.setup();
    axios.get.mockResolvedValue({
      data: [
        {
          name: 'Victoria',
          lineStatuses: [{ statusSeverityDescription: 'Good Service' }],
        },
      ],
    });

    render(
      <MemoryRouter>
        <StatusPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Victoria')).toBeInTheDocument();
    });

    expect(screen.getByText('Good Service')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open map' }));
    expect(screen.getByTestId('tfl-map')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hide map' }));
    expect(screen.queryByTestId('tfl-map')).not.toBeInTheDocument();
  });
});
