import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TfLMap from "../components/TfLMap";

export default function StatusPage() {
  const [tflStatus, setTflStatus] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchTfL();
  }, []);

  const fetchTfL = async () => {
    try {
      const res = await axios.get("https://api.tfl.gov.uk/Line/Mode/tube/Status");
      setTflStatus(res.data);
    } catch (err) {
      console.error("TfL error", err);
    }
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
          Start with a tailored route plan before you check live services so you know where to go when your upgrade arrives.
        </p>
        <Link to="/transport">
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

      <section
        aria-label="Live TfL map"
        style={{
          marginTop: "1.5rem",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid rgba(10, 31, 61, 0.15)",
          background: "linear-gradient(180deg, #fff8f3 0%, #eef2ff 100%)",
          boxShadow: "0 20px 40px rgba(10, 31, 61, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div style={{ flex: "1 1 220px" }}>
            <h2 style={{ margin: 0 }}>TfL Tube Map + Stadiums</h2>
            <p style={{ margin: "0.4rem 0 0" }}>
              Click the button to load the London tube network, see live line status, and highlight every Premier League stadium.
            </p>
          </div>
          <button
            onClick={() => setShowMap((prev) => !prev)}
            style={{
              padding: "0.9rem 1.6rem",
              borderRadius: "999px",
              border: "none",
              fontWeight: 600,
              background: "#0a1f3d",
              color: "#f4f8ff",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(10, 31, 61, 0.2)",
            }}
          >
            {showMap ? "Hide live map" : "Open interactive map"}
          </button>
        </div>
        {showMap && <TfLMap tflStatus={tflStatus} />}
      </section>

      <section
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        <section
          style={{
            padding: "1.5rem",
            borderRadius: "16px",
            border: "1px solid rgba(10, 31, 61, 0.15)",
            background: "#f8fbff",
          }}
        >
          <h2>TfL Tube Status</h2>
          {tflStatus.map((line, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: "0.8rem",
                marginBottom: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #d4e9ff",
                boxShadow: "0 10px 25px rgba(10, 31, 61, 0.08)",
              }}
            >
              <strong>{line.name}</strong>
              <p style={{ margin: "0.2rem 0 0", color: "#516088" }}>
                {line.lineStatuses[0]?.statusSeverityDescription}
              </p>
            </div>
          ))}
        </section>

        <section
          style={{
            padding: "1.5rem",
            borderRadius: "16px",
            border: "1px solid rgba(10, 31, 61, 0.15)",
            background: "#f8fbff",
          }}
        >
          <h2>Tottenham Stadium</h2>
          <div
            style={{
              marginTop: "0.6rem",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(10, 31, 61, 0.1)",
            }}
          >
            <img
              src="/assets/tottenham-stadium.jpg"
              alt="Tottenham Hotspur Stadium"
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
          <p style={{ marginTop: "0.75rem", color: "#516088" }}>
            A view of Tottenham Hotspur Stadium sits beside the tube status to keep the vibe of the matchday journey front and center.
          </p>
        </section>
      </section>
    </main>
  );
}
