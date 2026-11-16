import React, { useState } from "react";
import {
  fetchAdminDashboard,
  promoteUserToAdmin,
  setAdminSectionStatus,
} from "../api";

export default function AdminDashboardPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [promoteEmail, setPromoteEmail] = useState("");
  const [section, setSection] = useState("A");
  const [dashboard, setDashboard] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (action) => {
    if (!adminEmail.trim()) {
      setMessage("Admin email is required.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await action();
    } catch (error) {
      setMessage(error?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = () =>
    run(async () => {
      const data = await fetchAdminDashboard(adminEmail.trim());
      setDashboard(data);
      setMessage("Dashboard refreshed.");
    });

  const closeSection = () =>
    run(async () => {
      const result = await setAdminSectionStatus(adminEmail.trim(), section.trim(), true);
      setMessage(`Section ${result.section} closed (${result.updatedSpots} spots updated).`);
      const refreshed = await fetchAdminDashboard(adminEmail.trim());
      setDashboard(refreshed);
    });

  const openSection = () =>
    run(async () => {
      const result = await setAdminSectionStatus(adminEmail.trim(), section.trim(), false);
      setMessage(`Section ${result.section} opened (${result.updatedSpots} spots updated).`);
      const refreshed = await fetchAdminDashboard(adminEmail.trim());
      setDashboard(refreshed);
    });

  const promoteUser = () =>
    run(async () => {
      if (!promoteEmail.trim()) {
        setMessage("Target email is required for promotion.");
        return;
      }
      const result = await promoteUserToAdmin(adminEmail.trim(), promoteEmail.trim());
      setMessage(`Promoted ${result.email} to ${result.role}.`);
    });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        color: "#0a1f3d",
        background: "linear-gradient(180deg, #e7f4ff 0%, #ffffff 70%)",
      }}
    >
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #d8e5ff",
          borderRadius: "18px",
          padding: "1.5rem",
          boxShadow: "0 16px 30px rgba(10, 31, 61, 0.08)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Admin Dashboard</h1>
        <p style={{ color: "#4b5b78" }}>
          Review transaction metrics and control parking inventory by section.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <label>
            <div style={{ marginBottom: "0.3rem" }}>Admin email</div>
            <input
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
              placeholder="admin@example.com"
              style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #c9d7f4" }}
            />
          </label>

          <label>
            <div style={{ marginBottom: "0.3rem" }}>Parking section</div>
            <input
              value={section}
              onChange={(event) => setSection(event.target.value.toUpperCase())}
              placeholder="A"
              style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #c9d7f4" }}
            />
          </label>

          <label>
            <div style={{ marginBottom: "0.3rem" }}>Promote user email</div>
            <input
              value={promoteEmail}
              onChange={(event) => setPromoteEmail(event.target.value)}
              placeholder="user@example.com"
              style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #c9d7f4" }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button onClick={loadDashboard} disabled={loading}>Refresh Dashboard</button>
          <button onClick={closeSection} disabled={loading}>Close Section</button>
          <button onClick={openSection} disabled={loading}>Open Section</button>
          <button onClick={promoteUser} disabled={loading}>Promote to ADMIN</button>
        </div>

        {message && <p style={{ color: "#0f4fff" }}>{message}</p>}

        {dashboard && (
          <>
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <Card title="Total Users" value={dashboard.totalUsers} />
              <Card title="Admin Users" value={dashboard.adminUsers} />
              <Card title="Total Bookings" value={dashboard.totalBookings} />
              <Card title="Total Revenue" value={`£${dashboard.totalRevenue}`} />
              <Card title="Parking Spots" value={dashboard.totalParkingSpots} />
              <Card title="Reserved Spots" value={dashboard.reservedParkingSpots} />
            </div>

            <section style={{ marginTop: "1.5rem" }}>
              <h2 style={{ marginBottom: "0.5rem" }}>Recent Transactions</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <Th>Booking ID</Th>
                      <Th>Code</Th>
                      <Th>Status</Th>
                      <Th>Amount</Th>
                      <Th>Spot</Th>
                      <Th>Created</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard.recentTransactions || []).map((tx) => (
                      <tr key={tx.bookingId}>
                        <Td>{tx.bookingId}</Td>
                        <Td>{tx.confirmationCode}</Td>
                        <Td>{tx.status}</Td>
                        <Td>£{tx.amount}</Td>
                        <Td>{tx.spotName}</Td>
                        <Td>{tx.createdAt}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function Card({ title, value }) {
  return (
    <article
      style={{
        background: "#f7fbff",
        border: "1px solid #d9e8ff",
        borderRadius: "12px",
        padding: "0.8rem",
      }}
    >
      <div style={{ color: "#5b6d90", fontSize: "0.85rem" }}>{title}</div>
      <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{value}</div>
    </article>
  );
}

function Th({ children }) {
  return <th style={{ textAlign: "left", borderBottom: "1px solid #dbe7ff", padding: "0.5rem" }}>{children}</th>;
}

function Td({ children }) {
  return <td style={{ borderBottom: "1px solid #eef4ff", padding: "0.5rem" }}>{children}</td>;
}
