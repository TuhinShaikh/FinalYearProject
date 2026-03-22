import React from 'react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

const mockNavigate = vi.fn();
const loginMock = vi.fn();

vi.mock('../api', () => ({
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
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

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

  it('supports season/member id access with code 1882', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Season/Member ID'), '1882');
    await user.click(screen.getByRole('button', { name: 'Season/Member ID Access' }));

    expect(mockNavigate).toHaveBeenCalledWith('/booking', { replace: true });
  });

  it('shows INVALID when season/member id is wrong', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Season/Member ID'), '1234');
    await user.click(screen.getByRole('button', { name: 'Season/Member ID Access' }));

    expect(screen.getByRole('alert')).toHaveTextContent('INVALID');
  });
});
