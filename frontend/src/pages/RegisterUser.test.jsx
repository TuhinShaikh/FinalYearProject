import React from 'react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterUser from './RegisterUser';

const mockNavigate = vi.fn();
const registerMock = vi.fn();

vi.mock('../api', () => ({
  register: (...args) => registerMock(...args),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterUser', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    registerMock.mockReset();
  });

  it('submits registration and navigates to login', async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValue({ accessToken: 'token-123' });

    render(
      <MemoryRouter>
        <RegisterUser />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('Name'), '  Spurs Fan  ');
    await user.type(screen.getByPlaceholderText('Email'), '  fan@example.com  ');
    await user.type(screen.getByPlaceholderText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(registerMock).toHaveBeenCalledWith({
      name: 'Spurs Fan',
      email: 'fan@example.com',
      password: 'secret123',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('shows error message when registration fails', async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValue(new Error('Email already exists'));

    render(
      <MemoryRouter>
        <RegisterUser />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('Name'), 'Spurs Fan');
    await user.type(screen.getByPlaceholderText('Email'), 'fan@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Email already exists');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
