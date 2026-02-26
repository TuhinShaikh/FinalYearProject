import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TfLMap from "../components/TfLMap";

const stationSuggestions = ["LST", "CAM", "NOR", "IPW", "SST", "COL", "BHM"];

export default function StatusPage() {
  const [gaStatus, setGaStatus] = useState([]);
  const [tflStatus, setTflStatus] = useState([]);
  const [uberSurge, setUberSurge] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [stationField, setStationField] = useState("LST");
  const [activeStation, setActiveStation] = useState("LST");
  const [loadingGa, setLoadingGa] = useState(false);
  const [gaError, setGaError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchGreaterAnglia(activeStation);
  }, [activeStation]);

  useEffect(() => {
    fetchTfL();
    fetchUber();
  }, []);

  const fetchGreaterAnglia = async (targetStation) => {
    setLoadingGa(true);
    setGaError(null);
    try {
      const res = await axios.get("/api/trains/greater-anglia", {
        params: { station: targetStation },
      });
      setGaStatus(res.data.trainServices || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("GA error", err);
      setGaStatus([]);
      setGaError("Greater Anglia departures are currently unavailable.");
    } finally {
      setLoadingGa(false);
    }
  };

  const fetchTfL = async () => {
    try {
      const res = await axios.get("https://api.tfl.gov.uk/Line/Mode/tube/Status");
      setTflStatus(res.data);
    } catch (err) {
      console.error("TfL error", err);
    }
  };

  const fetchUber = () => {
    setUberSurge((Math.random() * 2 + 1).toFixed(2));
  };

  const handleApplyStation = () => {
    const normalized = stationField.trim().toUpperCase();
    if (normalized) {
      setActiveStation(normalized);
    }
  };

  const formatTime = (value) => value || "—";

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

      <section style={{ marginTop: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 0.3rem" }}>Greater Anglia Status</h2>
            <p style={{ margin: 0, color: "#516088" }}>
              Station {activeStation}
              {lastUpdated && ` • updated at ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              list="station-options"
              value={stationField}
              onChange={(e) => setStationField(e.target.value.toUpperCase())}
              aria-label="Station CRS code"
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "999px",
                border: "1px solid rgba(10, 31, 61, 0.2)",
                textTransform: "uppercase",
              }}
            />
            <datalist id="station-options">
              {stationSuggestions.map((code) => (
                <option value={code} key={code} />
              ))}
            </datalist>
            <button
              onClick={handleApplyStation}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                border: "1px solid rgba(10, 31, 61, 0.3)",
                background: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Load
            </button>
            <button
              onClick={() => fetchGreaterAnglia(activeStation)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                border: "1px solid rgba(10, 31, 61, 0.3)",
                background: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {gaError ? (
          <p style={{ color: "#b00020", marginTop: "0.8rem" }}>{gaError}</p>
        ) : null}

        {loadingGa && <p style={{ marginTop: "0.8rem" }}>Loading live departures…</p>}

        {!loadingGa && gaStatus.length === 0 && !gaError ? (
          <p style={{ color: "#3b4a67", marginTop: "0.8rem" }}>
            No live Greater Anglia services are visible right now.
          </p>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {gaStatus.map((t, i) => (
            <article
              key={`${t.std}-${i}`}
              style={{
                background: "#222",
                padding: "1rem",
                borderRadius: "12px",
                color: "white",
                minHeight: "160px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong style={{ fontSize: "1.1rem" }}>{t.destination?.[0]?.locationName || "Destination"}</strong>
                <p style={{ margin: "0.3rem 0", color: "rgba(255,255,255,0.8)" }}>{t.status || "Live"}</p>
                <p style={{ margin: 0 }}>
                  Scheduled: {formatTime(t.std)}
                  <br />
                  Expected: {formatTime(t.etd)}
                  <br />
                  {t.platform ? `Platform: ${t.platform}` : ""}
                </p>
              </div>
              {t.operator ? <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{t.operator}</span> : null}
            </article>
          ))}
        </div>
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
          <h2>Uber Surge Pricing</h2>
          <p>
            Current surge: <strong>{uberSurge}x</strong>
          </p>
        </section>
      </section>
    </main>
  );
}import React, { useEffect, useState } from "react";
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