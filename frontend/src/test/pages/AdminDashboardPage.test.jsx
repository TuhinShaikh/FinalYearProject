import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboardPage from '../../pages/AdminDashboardPage';
import {
  fetchAdminDashboard,
  promoteUserToAdmin,
  setAdminSectionStatus,
} from '../../api';

vi.mock('../../api', () => ({
  fetchAdminDashboard: vi.fn(),
  promoteUserToAdmin: vi.fn(),
  setAdminSectionStatus: vi.fn(),
}));

const dashboardPayload = {
  totalUsers: 10,
  adminUsers: 2,
  totalBookings: 22,
  totalRevenue: 1100,
  totalParkingSpots: 80,
  reservedParkingSpots: 24,
  recentTransactions: [
    {
      bookingId: 44,
      confirmationCode: 'CONF-44',
      status: 'PAID',
      amount: 25,
      spotName: 'A-12',
      createdAt: '2026-03-20T14:12:00',
    },
  ],
};

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchAdminDashboard.mockResolvedValue(dashboardPayload);
  });

  it('shows validation when admin email is missing', async () => {
    const user = userEvent.setup();
    render(<AdminDashboardPage />);

    await user.click(screen.getByRole('button', { name: /refresh dashboard/i }));

    expect(screen.getByText('Admin email is required.')).toBeInTheDocument();
    expect(fetchAdminDashboard).not.toHaveBeenCalled();
  });

  it('loads dashboard cards and transactions', async () => {
    const user = userEvent.setup();
    render(<AdminDashboardPage />);

    await user.type(screen.getByPlaceholderText('admin@example.com'), 'admin@club.com');
    await user.click(screen.getByRole('button', { name: /refresh dashboard/i }));

    await waitFor(() => {
      expect(fetchAdminDashboard).toHaveBeenCalledWith('admin@club.com');
      expect(screen.getByText('Dashboard refreshed.')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('CONF-44')).toBeInTheDocument();
  });

  it('closes and opens section, then refreshes dashboard', async () => {
    const user = userEvent.setup();
    setAdminSectionStatus
      .mockResolvedValueOnce({ section: 'B', updatedSpots: 5 })
      .mockResolvedValueOnce({ section: 'B', updatedSpots: 5 });

    render(<AdminDashboardPage />);
    await user.type(screen.getByPlaceholderText('admin@example.com'), 'admin@club.com');
    await user.clear(screen.getByPlaceholderText('A'));
    await user.type(screen.getByPlaceholderText('A'), 'b');

    await user.click(screen.getByRole('button', { name: /close section/i }));
    await waitFor(() => {
      expect(setAdminSectionStatus).toHaveBeenCalledWith('admin@club.com', 'B', true);
      expect(screen.getByText('Section B closed (5 spots updated).')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /open section/i }));
    await waitFor(() => {
      expect(setAdminSectionStatus).toHaveBeenCalledWith('admin@club.com', 'B', false);
      expect(screen.getByText('Section B opened (5 spots updated).')).toBeInTheDocument();
    });
  });

  it('shows promotion validation and success message', async () => {
    const user = userEvent.setup();
    promoteUserToAdmin.mockResolvedValue({ email: 'fan@club.com', role: 'ADMIN' });

    render(<AdminDashboardPage />);
    await user.type(screen.getByPlaceholderText('admin@example.com'), 'admin@club.com');

    await user.click(screen.getByRole('button', { name: /promote to admin/i }));
    expect(screen.getByText('Target email is required for promotion.')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('user@example.com'), 'fan@club.com');
    await user.click(screen.getByRole('button', { name: /promote to admin/i }));

    await waitFor(() => {
      expect(promoteUserToAdmin).toHaveBeenCalledWith('admin@club.com', 'fan@club.com');
      expect(screen.getByText('Promoted fan@club.com to ADMIN.')).toBeInTheDocument();
    });
  });

  it('shows API error message when action fails', async () => {
    const user = userEvent.setup();
    fetchAdminDashboard.mockRejectedValueOnce(new Error('Forbidden'));
    render(<AdminDashboardPage />);

    await user.type(screen.getByPlaceholderText('admin@example.com'), 'admin@club.com');
    await user.click(screen.getByRole('button', { name: /refresh dashboard/i }));

    await waitFor(() => {
      expect(screen.getByText('Forbidden')).toBeInTheDocument();
    });
  });
});