// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

// Helper: attach JWT if available
function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ===============================
// Authentication
// ===============================
export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // contains access + refresh tokens
}

export async function register(username, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
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