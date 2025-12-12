import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function JourneyPlannerPage() {
  const [station, setStation] = useState("LST");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTrains = useCallback(async (targetStation) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8080/api/trains/greater-anglia", {
        params: { station: targetStation },
      });

      console.log("API response:", res.data);

      setTrains(res.data.trainServices || []);
    } catch (err) {
      console.error("Error fetching trains", err);
      setError("Unable to reach Greater Anglia right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrains("LST");
  }, [loadTrains]);

  return (
    <main
      style={{
        padding: "2rem",
        color: "#0a1f3d",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #e7f4ff 0%, #ffffff 70%)",
      }}
    >
      <h1>Greater Anglia Live Departures</h1>
      <p>Enter a station CRS code (e.g. LST for Liverpool Street) to view live trains.</p>

      <div style={{ marginTop: "1rem" }}>
        <input
          value={station}
          onChange={(e) => setStation(e.target.value.toUpperCase())}
          placeholder="Station CRS"
          style={{
            padding: "0.5rem",
            marginRight: "1rem",
            borderRadius: "6px",
            border: "1px solid #d4e9ff",
            minWidth: "150px",
          }}
        />
        <button
          onClick={() => loadTrains(station)}
          style={{
            padding: "0.7rem 1.5rem",
            backgroundColor: "#3b9bff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            color: "white",
          }}
        >
          {loading ? "Loading..." : "Get Departures"}
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {error && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid rgba(220, 0, 55, 0.2)",
              background: "rgba(255, 235, 238, 0.9)",
              color: "#b00020",
            }}
          >
            <strong>Heads up:</strong> {error}
          </div>
        )}
        {!loading && trains.length === 0 && !error && (
          <p style={{ color: "#0a1f3d", opacity: 0.85 }}>
            No departures loaded yet. Tap "Get Departures" or change the CRS code to
            query a different station.
          </p>
        )}
        {Array.isArray(trains) && trains.map((t, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#f8fbff",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #d4e9ff",
              boxShadow: "0 20px 30px rgba(10, 31, 61, 0.08)",
            }}
          >
            <h2>{t.destination[0].locationName}</h2>
            <p><strong>Scheduled:</strong> {t.std}</p>
            <p><strong>Expected:</strong> {t.etd}</p>
            <p><strong>Operator:</strong> {t.operator}</p>
          </div>
        ))}
      </div>
    </main>
  );
}