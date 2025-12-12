import React, { useState } from "react";

export default function RideOptionsPage() {
  const [rides, setRides] = useState([]);

  const fetchRides = () => {
    // Provide mocked ride-hailing results so users can preview service choices
    const mockData = [
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

    setRides(mockData);
  };

  return (
    <main
      role="main"
      aria-label="Ride Options"
      style={{
        padding: "2rem",
        color: "#0a1f3d",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #e7f4ff 0%, #ffffff 60%)",
      }}
    >
      <h1>Ride‑Hailing Options</h1>
      <p>Find the fastest and cheapest rides near Tottenham Hotspur Stadium.</p>

        <button
          onClick={fetchRides}
          style={{
            padding: "0.7rem 1.5rem",
            backgroundColor: "#3b9bff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "1rem",
            color: "white",
          }}
        >
          Show Available Rides
        </button>

      <div style={{ marginTop: "2rem" }}>
        {rides.map((ride, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#f8fbff",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #d4e9ff",
              boxShadow: "0 20px 40px rgba(10, 31, 61, 0.08)",
            }}
          >
            <h2 style={{ margin: 0 }}>{ride.provider}</h2>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>ETA:</strong> {ride.eta} minutes
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Price:</strong> £{ride.price}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Pickup Zone:</strong> {ride.zone}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}