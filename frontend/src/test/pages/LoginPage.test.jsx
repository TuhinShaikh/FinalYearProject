import React from 'react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';

// Login tests focus on secure default behavior and normal auth flow.

const mockNavigate = vi.fn();
const loginMock = vi.fn();

vi.mock('../../api', () => ({
  login: (...args) => loginMock(...args),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    loginMock.mockReset();
  });

  it('shows validation error when submit is missing credentials', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Submitting the form directly bypasses browser native required-field blocking in jsdom.
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }).closest('form'));

    expect(screen.getByText('Please provide both an email and password.')).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('logs in and navigates to booking when token is returned', async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({ accessToken: 'token-123' });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Email address'), 'fan@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(loginMock).toHaveBeenCalledWith('fan@example.com', 'secret123');
    expect(mockNavigate).toHaveBeenCalledWith('/booking', { replace: true });
  });

  it('keeps season/member id access hidden by default', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.queryByLabelText('Season/Member ID')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Season/Member ID Access' })).not.toBeInTheDocument();
  });
});
