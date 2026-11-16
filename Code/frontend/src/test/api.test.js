import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bookParking,
  cancelBooking,
  clearAuthData,
  fetchAdminDashboard,
  fetchLiveRides,
  getStoredUser,
  isAuthenticated,
  login,
  logout,
  pay,
  promoteUserToAdmin,
  refund,
  register,
  setAdminSectionStatus,
  viewBookings,
} from '../api';

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

  it('returns null when stored user JSON is invalid', () => {
    localStorage.setItem('user', '{bad-json');
    expect(getStoredUser()).toBeNull();
  });

  it('logs out and clears auth storage even if backend call fails', async () => {
    localStorage.setItem('accessToken', 'a');
    localStorage.setItem('refreshToken', 'b');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));

    await logout();

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('throws normalized backend message on failed admin dashboard request', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Forbidden',
      text: async () => JSON.stringify({ message: 'Access denied' }),
    });

    await expect(fetchAdminDashboard('admin@club.com')).rejects.toThrow('Access denied');
  });

  it('sets section status via admin endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      statusText: 'OK',
      text: async () => JSON.stringify({ section: 'A', updatedSpots: 2 }),
    });

    const data = await setAdminSectionStatus('admin@club.com', 'A', true);

    expect(data).toEqual({ section: 'A', updatedSpots: 2 });
    expect(fetchSpy.mock.calls[0][0]).toContain('/api/admin/sections/A/close');
  });

  it('promotes a user to admin', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      statusText: 'OK',
      text: async () => JSON.stringify({ email: 'fan@club.com', role: 'ADMIN' }),
    });

    const data = await promoteUserToAdmin('admin@club.com', 'fan@club.com');
    expect(data.role).toBe('ADMIN');
  });

  it('falls back to proxy URL when live rides primary URL fails', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce({
        ok: true,
        statusText: 'OK',
        text: async () => JSON.stringify({ cabs: [] }),
      });

    const data = await fetchLiveRides({ lat: 51.6, lon: -0.1, radiusMeters: 1000 });

    expect(data).toEqual({ cabs: [] });
    expect(fetchSpy.mock.calls[1][0]).toContain('/api/rides/live?');
  });

  it('throws when booking endpoint fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false });
    await expect(bookParking(5)).rejects.toThrow('Booking failed');
  });

  it('throws when cancelling booking endpoint fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false });
    await expect(cancelBooking(12)).rejects.toThrow('Cancel failed');
  });

  it('throws when viewing bookings endpoint fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false });
    await expect(viewBookings()).rejects.toThrow('Fetch bookings failed');
  });

  it('throws when payment endpoint fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false });
    await expect(pay(2500, 'card_nonce')).rejects.toThrow('Payment failed');
  });

  it('throws when refund endpoint fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false });
    await expect(refund('pay-123')).rejects.toThrow('Refund failed');
  });
});
