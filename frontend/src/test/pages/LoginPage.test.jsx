import React from 'react';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
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
    vi.stubEnv('VITE_ENABLE_DEMO_ID_ACCESS', 'false');
    mockNavigate.mockReset();
    loginMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
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

  it('shows season/member id access controls', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Season/Member ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Season/Member ID Access' })).toBeInTheDocument();
  });

  it('shows backend message when login fails', async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Email address'), 'fan@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('shows error when login returns no token', async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({});

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Email address'), 'fan@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Login succeeded but no token was returned.');
  });

  it('routes to admin when season/member id is admin code', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Season/Member ID'), '2025');
    await user.click(screen.getByRole('button', { name: 'Season/Member ID Access' }));

    expect(localStorage.getItem('adminAccessGranted')).toBe('true');
    expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
  });

  it('routes to booking and clears admin access for public id code', async () => {
    const user = userEvent.setup();
    localStorage.setItem('adminAccessGranted', 'true');

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Season/Member ID'), '1882');
    await user.click(screen.getByRole('button', { name: 'Season/Member ID Access' }));

    expect(localStorage.getItem('adminAccessGranted')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/booking', { replace: true });
  });

  it('shows INVALID for unknown id code', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Season/Member ID'), '9999');
    await user.click(screen.getByRole('button', { name: 'Season/Member ID Access' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('INVALID');
  });
});
