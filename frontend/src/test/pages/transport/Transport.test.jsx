import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransportPage from '../../../pages/transport/Transport';

const journeyResponse = {
  journeys: [
    {
      duration: 24,
      legs: [
        {
          mode: { name: 'tube' },
          departurePoint: { commonName: 'London Bridge Underground Station' },
          arrivalPoint: { commonName: "King's Cross St. Pancras Underground Station" },
        },
      ],
    },
  ],
};

// Transport tests cover the most important planner flow: fetch route, then save and hand off to TfL.
describe('TransportPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => journeyResponse,
    });

    Object.defineProperty(window, 'open', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
  });

  it('plans a journey and displays normalized result', async () => {
    const user = userEvent.setup();
    render(<TransportPage />);

    await user.click(screen.getByRole('button', { name: 'Plan journey' }));

    await waitFor(() => {
      expect(screen.getByText('Found a 24-minute journey with 1 steps.')).toBeInTheDocument();
    });
    expect(screen.getByText('Suggested route')).toBeInTheDocument();
    expect(screen.getByText('tube')).toBeInTheDocument();
  });

  it('adds route and opens TfL planner in a new tab', async () => {
    const user = userEvent.setup();
    render(<TransportPage />);

    await user.click(screen.getByRole('button', { name: 'Plan journey' }));
    await waitFor(() => {
      expect(screen.getByText('Suggested route')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Add & go to TfL' }));

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Saved journeys')).toBeInTheDocument();
  });
});
