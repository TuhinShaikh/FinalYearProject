// src/api.js
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

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

export async function register(username, password) {
  const response = await fetch(buildUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
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
  const res = await fetch(`${API_URL}/bookings`, {
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
  const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Cancel failed");
  return res.json();
}

export async function viewBookings() {
  const res = await fetch(`${API_URL}/bookings`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Fetch bookings failed");
  return res.json();
}

// ===============================
// Payments
// ===============================
export async function pay(amountCents, sourceId) {
  const res = await fetch(`${API_URL}/payments`, {
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
  const res = await fetch(`${API_URL}/payments/${paymentId}/refund`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Refund failed");
  return res.json();
}