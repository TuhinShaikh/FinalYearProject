import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TfLMap from "../components/TfLMap";

export default function StatusPage() {
  const [gaStatus, setGaStatus] = useState([]);
  const [tflStatus, setTflStatus] = useState([]);
  const [uberSurge, setUberSurge] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchGreaterAnglia();
    fetchTfL();
    fetchUber();
  }, []);

  // Fetch the Greater Anglia departures published by our backend endpoint
  const fetchGreaterAnglia = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/trains/greater-anglia");
      setGaStatus(res.data.trainServices || []);
    } catch (err) {
      console.error("GA error", err);
    }
  };

  // Pull the live TfL tube status feed directly from TfL
  const fetchTfL = async () => {
    try {
      const res = await axios.get("https://api.tfl.gov.uk/Line/Mode/tube/Status");
      setTflStatus(res.data);
    } catch (err) {
      console.error("TfL error", err);
    }
  };

  // Create a mock Uber surge multiplier for interest
  const fetchUber = () => {
    setUberSurge((Math.random() * 2 + 1).toFixed(2)); // 1.0x – 3.0x
  };

  return (
    <main
      style={{
        padding: "2rem",
        color: "#0a1f3d",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #e7f4ff 0%, #ffffff 70%)",
      }}
    >
      <h1>TfL Status Dashboard</h1>

      <section
        aria-label="Plan a journey"
        style={{
          marginTop: "1.5rem",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid rgba(10, 31, 61, 0.15)",
          background: "linear-gradient(180deg, #f4fbff 0%, #dcebff 100%)",
          boxShadow: "0 20px 40px rgba(10, 31, 61, 0.08)",
        }}
      >
        <h2>Plan Journey</h2>
        <p style={{ margin: "0.5rem 0" }}>
          Start with a tailored route plan before you check live services so you
          know where to go when your upgrade arrives.
        </p>
        <Link to="/journey">
          <button
            style={{
              marginTop: "0.5rem",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "999px",
              background: "#0a1f3d",
              color: "#f4f8ff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Open Journey Planner
          </button>
        </Link>
      </section>

      {/* Greater Anglia train status data */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Greater Anglia Status</h2>
        {gaStatus.length === 0 && <p>No live data.</p>}
        {gaStatus.map((t, i) => (
          <div key={i} style={{ background: "#222", padding: "1rem", marginBottom: "1rem" }}>
            <strong>{t.destination[0].locationName}</strong>
            <p>Scheduled: {t.std}</p>
            <p>Expected: {t.etd}</p>
          </div>
        ))}
      </section>

      {/* TfL tube status panels */}
      <section style={{ marginTop: "2rem" }}>
        <h2>TfL Tube Status</h2>
        {tflStatus.map((line, i) => (
          <div
            key={i}
            style={{
              background: "#f8fbff",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #d4e9ff",
              boxShadow: "0 15px 30px rgba(10, 31, 61, 0.08)",
            }}
          >
            <strong>{line.name}</strong>
            <p>{line.lineStatuses[0].statusSeverityDescription}</p>
          </div>
        ))}
      </section>

      {/* Mock Uber surge information */}
      <section
        style={{
          marginTop: "2rem",
          background: "#f8fbff",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #d4e9ff",
          boxShadow: "0 15px 30px rgba(10, 31, 61, 0.08)",
        }}
      >
        <h2>Uber Surge Pricing</h2>
        <p>
          Current surge: <strong>{uberSurge}x</strong>
        </p>
      </section>
    </main>
  );
}