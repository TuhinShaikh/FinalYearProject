import React, { useState, useEffect } from "react";

export default function StatusPage() {
  const [status, setStatus] = useState({
    trains: "Loading...",
    tfl: "Loading...",
    parking: "Loading...",
    weather: "Loading...",
    crowd: "Loading...",
  });

  useEffect(() => {
    // ✅ Mock live data (looks real for demo)
    const timer = setTimeout(() => {
      setStatus({
        trains: "Greater Anglia running normally ✅",
        tfl: "Victoria Line delays ❗ (signal failure at Seven Sisters)",
        parking: "32 / 100 spaces available 🅿️",
        weather: "Light rain 🌧️ — minor delays expected",
        crowd: "Moderate congestion near South Stand 🚶‍♂️🚶‍♀️",
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ padding: "2rem", color: "white" }}>
      <h1>Live Stadium Status</h1>
      <p>Real‑time updates for travel, parking, and crowd flow.</p>

      <div style={{ marginTop: "2rem" }}>
        <StatusCard title="Greater Anglia" value={status.trains} />
        <StatusCard title="TfL Underground" value={status.tfl} />
        <StatusCard title="Parking Availability" value={status.parking} />
        <StatusCard title="Weather Impact" value={status.weather} />
        <StatusCard title="Crowd Congestion" value={status.crowd} />
      </div>
    </main>
  );
}

function StatusCard({ title, value }) {
  return (
    <div
      style={{
        backgroundColor: "#222",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "8px",
        border: "1px solid #444",
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ marginTop: "0.5rem" }}>{value}</p>
    </div>
  );
}