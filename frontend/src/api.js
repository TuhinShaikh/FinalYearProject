// src/api.js
// I keep all frontend HTTP calls here so auth, bookings, rides, and payments share one client style.
const API_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/$/, "");

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function saveAuthData(payload = {}) {
  if (payload.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
  }
  if (payload.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
  }
  if (payload.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  }
}

export function clearAuthData() {
  [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY].forEach((key) =>
    localStorage.removeItem(key)
  );
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

function normalizeAuthToken(token = "") {
  return token.replace(/-/g, "+").replace(/_/g, "/");
}

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const decoded = JSON.parse(atob(normalizeAuthToken(payload)));
    if (typeof decoded.exp === "number") {
      return decoded.exp * 1000 > Date.now();
    }
    return true;
  } catch (error) {
    console.warn("Failed to parse JWT", error);
    return false;
  }
}

export function isAuthenticated() {
  return isTokenValid(getAccessToken());
}

function getAuthHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildUrl(path) {
  if (!API_URL) {
    return `${path.startsWith("/api") ? "" : "/api"}${path}`;
  }
  return `${API_URL}${path}`;
}

async function parseJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function handleResponse(response) {
  const data = await parseJson(response);
  if (!response.ok) {
    const message = data?.message || response.statusText || "Request failed";
    throw new Error(message);
  }
  return data;
}

// ===============================
// Authentication
// ===============================
export async function login(email, password) {
  const response = await fetch(buildUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  saveAuthData(data);
  return data;
}

export async function register({ name, username, email, password }) {
  // I normalize to `name` because backend registration currently expects that field.
  const resolvedName = (name ?? username ?? "").trim();
  const body = JSON.stringify({
    ...(email ? { email } : {}),
    ...(resolvedName ? { name: resolvedName } : {}),
    password,
  });
  const response = await fetch(buildUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body,
  });
  const data = await handleResponse(response);
  saveAuthData(data);
  return data;
}

export async function logout() {
  clearAuthData();
  await fetch(buildUrl("/api/auth/logout"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  }).catch(() => null);
}

// ===============================
// Parking
// ===============================
export async function bookParking(spotId) {
  const res = await fetch(buildUrl(`/bookings`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ spotId }),
  });
  if (!res.ok) throw new Error("Booking failed");
  return res.json();
}

export async function cancelBooking(bookingId) {
  const res = await fetch(buildUrl(`/bookings/${bookingId}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Cancel failed");
  return res.json();
}

export async function viewBookings() {
  const res = await fetch(buildUrl(`/bookings`), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Fetch bookings failed");
  return res.json();
}

// ===============================
// Payments
// ===============================
export async function pay(amountCents, sourceId) {
  const res = await fetch(buildUrl(`/payments`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ amountCents, sourceId }),
  });
  if (!res.ok) throw new Error("Payment failed");
  return res.json();
}

export async function refund(paymentId) {
  const res = await fetch(buildUrl(`/payments/${paymentId}/refund`), {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Refund failed");
  return res.json();
}

// ===============================
// Ride options
// ===============================
export async function fetchLiveRides({ lat = 51.6048, lon = -0.066, radiusMeters = 3000 } = {}) {
  const query = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    radiusMeters: String(radiusMeters),
  });

  const requestOptions = {
    method: "GET",
    credentials: "include",
  };

  const primaryUrl = buildUrl(`/api/rides/live?${query.toString()}`);

  try {
    const response = await fetch(primaryUrl, requestOptions);
    return await handleResponse(response);
  } catch (error) {
    // If direct backend URL fails (common with WSL/Windows localhost routing), retry via Vite proxy.
    if (primaryUrl.startsWith("http")) {
      const fallbackResponse = await fetch(`/api/rides/live?${query.toString()}`, requestOptions);
      return handleResponse(fallbackResponse);
    }
    throw error;
  }
}

// ===============================
// Admin dashboard
// ===============================
function adminHeaders(adminEmail) {
  return {
    ...getAuthHeaders(),
    "X-Admin-Email": adminEmail,
    "Content-Type": "application/json",
  };
}

export async function fetchAdminDashboard(adminEmail) {
  const response = await fetch(buildUrl("/api/admin/dashboard"), {
    method: "GET",
    headers: adminHeaders(adminEmail),
  });
  return handleResponse(response);
}

export async function setAdminSectionStatus(adminEmail, section, closed) {
  const action = closed ? "close" : "open";
  const response = await fetch(buildUrl(`/api/admin/sections/${encodeURIComponent(section)}/${action}`), {
    method: "POST",
    headers: adminHeaders(adminEmail),
  });
  return handleResponse(response);
}

export async function promoteUserToAdmin(adminEmail, email) {
  const response = await fetch(buildUrl("/api/admin/users/promote"), {
    method: "POST",
    headers: adminHeaders(adminEmail),
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
}