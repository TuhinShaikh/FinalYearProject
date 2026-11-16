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
  }, 10000);

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

  it('shows validation when origin or destination is missing', async () => {
    const user = userEvent.setup();
    render(<TransportPage />);

    const originInput = screen.getByDisplayValue('London Bridge');
    await user.clear(originInput);
    await user.click(screen.getByRole('button', { name: 'Plan journey' }));

    expect(screen.getByText('Enter both an origin and a destination before planning.')).toBeInTheDocument();
  });

  it('handles TfL disambiguation response and allows selecting suggestion', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 300,
      json: async () => ({
        fromLocationDisambiguation: {
          disambiguationOptions: [{ parameterValue: 'origin-1', place: { commonName: 'Tottenham Hale' } }],
        },
        toLocationDisambiguation: {
          disambiguationOptions: [{ parameterValue: 'dest-1', place: { commonName: 'Seven Sisters' } }],
        },
      }),
    });

    render(<TransportPage />);
    await user.click(screen.getByRole('button', { name: 'Plan journey' }));

    expect(await screen.findByText(/TfL needs more detail/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tottenham Hale' }));
    expect(screen.getByText(/Set origin to Tottenham Hale/i)).toBeInTheDocument();
  });

  it('shows no-journey status when TfL returns empty journey list', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ journeys: [] }),
    });

    render(<TransportPage />);
    await user.click(screen.getByRole('button', { name: 'Plan journey' }));

    expect(await screen.findByText('TfL did not return any journeys for that route.')).toBeInTheDocument();
  });

  it('shows fallback error when TfL returns error response', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    render(<TransportPage />);
    await user.click(screen.getByRole('button', { name: 'Plan journey' }));

    expect(await screen.findByText('Unable to plan the route right now. Try again in a moment.')).toBeInTheDocument();
  });

  it('requires a planned journey before add-and-go action', async () => {
    const user = userEvent.setup();
    render(<TransportPage />);

    await user.click(screen.getByRole('button', { name: 'Add & go to TfL' }));
    expect(screen.getByText('Plan a journey first so you know what you are adding.')).toBeInTheDocument();
    expect(window.open).not.toHaveBeenCalled();
  });
});
