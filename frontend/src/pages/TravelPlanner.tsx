import React, { useState } from "react";
import axios from "axios";

export default function TravelPlanner() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/travel/recommend", null, {
        params: {
          origin: "Stratford",
          destination: "Liverpool Street",
          accessibilityNeeded: true,
          badWeather: false,
        },
      });

      setOptions(response.data || []);
    } catch (err) {
      console.error("Failed to fetch travel recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      role="main"
      aria-label="Travel Planner"
      style={{ padding: "2rem", color: "white" }}
    >
      <h1>Travel Planner</h1>
      <p>Get recommended routes based on accessibility and weather conditions.</p>

      <button
        onClick={fetchRecommendations}
        style={{
          padding: "0.7rem 1.5rem",
          backgroundColor: "#00bfa5",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        {loading ? "Loading..." : "Get Recommendations"}
      </button>

      <div style={{ marginTop: "2rem" }}>
        {options.length === 0 && !loading && (
          <p style={{ opacity: 0.7 }}>No recommendations yet. Click the button above.</p>
        )}

        {options.map((opt, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#222",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #444",
            }}
          >
            <h2 style={{ margin: 0 }}>{opt.mode}</h2>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Provider:</strong> {opt.provider}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Estimated Time:</strong> {opt.estimatedTime} mins
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Cost:</strong> £{opt.cost}
            </p>

            {opt.recommended && (
              <p style={{ color: "#00ff88", fontWeight: "bold" }}>★ Recommended Route</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}