import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuthData, isAuthenticated, login, register } from '../api';

// API tests focus on auth token persistence and payload normalization rules.

describe('api module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('stores access token after login', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ accessToken: 'abc.def.ghi' }),
      statusText: 'OK',
    });

    const result = await login('fan@example.com', 'secret123');

    expect(result.accessToken).toBe('abc.def.ghi');
    expect(localStorage.getItem('accessToken')).toBe('abc.def.ghi');
  });

  it('normalizes register payload by using username when name is missing', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ accessToken: 'token-123' }),
      statusText: 'OK',
    });

    await register({ username: 'SpursFan', email: 'fan@example.com', password: 'pw' });

    const fetchOptions = fetchSpy.mock.calls[0][1];
    const body = JSON.parse(fetchOptions.body);

    expect(body).toEqual({
      email: 'fan@example.com',
      name: 'SpursFan',
      password: 'pw',
    });
  });

  it('returns false from isAuthenticated when token is missing or malformed', () => {
    expect(isAuthenticated()).toBe(false);

    localStorage.setItem('accessToken', 'bad-token');
    expect(isAuthenticated()).toBe(false);
  });

  it('clearAuthData removes auth keys from storage', () => {
    localStorage.setItem('accessToken', 'a');
    localStorage.setItem('refreshToken', 'b');
    localStorage.setItem('user', '{"id":1}');

    clearAuthData();

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
