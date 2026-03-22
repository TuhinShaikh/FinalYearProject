import React, { useState } from "react";
import { fetchLiveRides } from "../api";

// I use this page to present quick ride-hailing comparisons near the stadium pickup zones.

export default function RideOptionsPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fallbackRides = [
    {
      provider: "UberX",
      eta: 4,
      price: 18,
      zone: "South Stand Pickup Zone A",
    },
    {
      provider: "UberXL",
      eta: 6,
      price: 28,
      zone: "South Stand Pickup Zone A",
    },
    {
      provider: "Uber Exec",
      eta: 8,
      price: 42,
      zone: "West Stand VIP Zone",
    },
    {
      provider: "Lyft",
      eta: 5,
      price: 20,
      zone: "North Stand Pickup Zone C",
    },
    {
      provider: "Bolt",
      eta: 3,
      price: 16,
      zone: "East Stand Pickup Zone B",
    },
  ];

  const normalizeLiveRides = (payload) => {
    if (!Array.isArray(payload)) return [];

    return payload.map((ride, index) => ({
      provider: ride.operatorName || ride.companyName || `Local Operator ${index + 1}`,
      eta: Number(ride.minutesUntil || ride.waitTimeMinutes || 0),
      price: Number(ride.estimatedFare || ride.price || 0) || 0,
      zone: ride.pickupPoint || ride.placeName || "Nearby pickup zone",
    }));
  };

  const fetchRides = async () => {
    setError("");
    setLoading(true);
    try {
      const live = await fetchLiveRides();
      const normalized = normalizeLiveRides(live);

      if (normalized.length > 0) {
        setRides(normalized);
      } else {
        setRides(fallbackRides);
        setError("Live rides were empty, so fallback sample rides are shown.");
      }
    } catch {
      // Fallback keeps the page demonstrable even when live endpoint is unavailable.
      setRides(fallbackRides);
      setError("Live rides are unavailable right now; showing fallback sample rides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      role="main"
      aria-label="Ride Options"
      style={{
        minHeight: "100vh",
        padding: "3rem 1.5rem 4rem",
        color: "#0a1f3d",
        background: "radial-gradient(circle at top, #e9f4ff 0%, #ffffff 70%)",
      }}
    >
      <section
        style={{
          margin: "0 auto",
          maxWidth: "1080px",
          background: "rgba(255, 255, 255, 0.93)",
          borderRadius: "28px",
          padding: "2.8rem",
          boxShadow: "0 25px 45px rgba(9, 25, 79, 0.15)",
          border: "1px solid #e4ecff",
        }}
      >
        <div style={{ marginBottom: "1.8rem" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.3rem",
              color: "#6b7cff",
              fontSize: "0.8rem",
              margin: 0,
            }}
          >
            Rides
          </p>
          <h1 style={{ margin: "0.4rem 0 0" }}>Ride‑Hailing Options</h1>
          <p style={{ margin: "0.5rem 0 0", color: "#42506d" }}>
            Find the fastest and cheapest rides near Tottenham Hotspur Stadium.
          </p>
        </div>

        <button
          // This button intentionally triggers data generation on demand to keep first render lightweight.
          onClick={fetchRides}
          disabled={loading}
          style={{
            padding: "0.85rem 1.5rem",
            backgroundColor: "#0f4fff",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            color: "white",
            fontWeight: 600,
            boxShadow: "0 12px 20px rgba(15, 79, 255, 0.2)",
            opacity: loading ? 0.65 : 1,
          }}
        >
          {loading ? "Loading rides..." : "Show Available Rides"}
        </button>

        {error && (
          <p role="status" aria-live="polite" style={{ marginTop: "0.75rem", color: "#8a2c2c" }}>
            {error}
          </p>
        )}

        <div
          style={{
            marginTop: "1.8rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {rides.map((ride, index) => (
            <article
              key={index}
              style={{
                background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
                padding: "1.25rem",
                borderRadius: "18px",
                border: "1px solid #dfe8ff",
                boxShadow: "0 16px 28px rgba(10, 31, 61, 0.08)",
              }}
            >
              <h2 style={{ margin: "0 0 0.5rem" }}>{ride.provider}</h2>
              <p style={{ margin: "0.35rem 0", color: "#1e2f52" }}>
                <strong>ETA:</strong> {ride.eta} minutes
              </p>
              <p style={{ margin: "0.35rem 0", color: "#1e2f52" }}>
                <strong>Price:</strong> £{ride.price}
              </p>
              <p style={{ margin: "0.35rem 0", color: "#1e2f52" }}>
                <strong>Pickup Zone:</strong> {ride.zone}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}