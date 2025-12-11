import React, { useState } from "react";
import axios from "axios";

export default function JourneyPlannerPage() {
  const [station, setStation] = useState("LST");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrains = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/trains/greater-anglia", {
        params: { station },
      });

      console.log("API response:", res.data);

      // ✅ Extract the array safely
      setTrains(res.data.trainServices || []);
    } catch (err) {
      console.error("Error fetching trains", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", color: "white" }}>
      <h1>Greater Anglia Live Departures</h1>
      <p>Enter a station CRS code (e.g. LST for Liverpool Street) to view live trains.</p>

      <div style={{ marginTop: "1rem" }}>
        <input
          value={station}
          onChange={(e) => setStation(e.target.value.toUpperCase())}
          placeholder="Station CRS"
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <button
          onClick={fetchTrains}
          style={{
            padding: "0.7rem 1.5rem",
            backgroundColor: "#00bfa5",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Get Departures"}
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {Array.isArray(trains) && trains.map((t, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#222",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #444",
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