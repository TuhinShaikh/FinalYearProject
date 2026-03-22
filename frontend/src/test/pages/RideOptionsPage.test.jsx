import React from 'react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RideOptionsPage from '../../pages/RideOptionsPage';

// This suite keeps confidence in both the live-rides happy path and the fallback safety net.

const fetchLiveRidesMock = vi.fn();

vi.mock('../../api', () => ({
  fetchLiveRides: (...args) => fetchLiveRidesMock(...args),
}));

describe('RideOptionsPage', () => {
  beforeEach(() => {
    fetchLiveRidesMock.mockReset();
  });

  it('renders live rides from API', async () => {
    const user = userEvent.setup();
    fetchLiveRidesMock.mockResolvedValue([
      {
        operatorName: 'Bolt',
        minutesUntil: 5,
        estimatedFare: 17,
        pickupPoint: 'North Gate',
      },
    ]);

    render(<RideOptionsPage />);

    await user.click(screen.getByRole('button', { name: 'Show Available Rides' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Bolt' })).toBeInTheDocument();
    });
    expect(screen.getByText(/ETA:/)).toBeInTheDocument();
    expect(screen.getByText(/Pickup Zone:/)).toBeInTheDocument();
  });

  it('falls back to sample rides if live endpoint fails', async () => {
    const user = userEvent.setup();
    fetchLiveRidesMock.mockRejectedValue(new Error('network down'));

    render(<RideOptionsPage />);

    await user.click(screen.getByRole('button', { name: 'Show Available Rides' }));

    await waitFor(() => {
      expect(
        screen.getByText('Live rides are unavailable right now; showing fallback sample rides.')
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'UberX' })).toBeInTheDocument();
  });
});
