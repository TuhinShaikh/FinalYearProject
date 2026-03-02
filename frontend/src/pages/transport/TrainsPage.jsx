import React, { useCallback, useState } from "react";

const formatDuration = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
};

const formatLocalTime = (iso = "") => {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const buildDefaultDate = () => new Date().toISOString().slice(0, 10);
const buildDefaultTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const formatStops = (stopPoints = []) => {
  return stopPoints
    .map((point) => point?.commonName || point?.name || point?.id)
    .filter(Boolean)
    .join(" → ");
};

export default function TransportTrainsPage() {
  const [appId, setAppId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [origin, setOrigin] = useState("Kings Cross St. Pancras");
  const [destination, setDestination] = useState("Waterloo");
  const [dateInput, setDateInput] = useState(buildDefaultDate);
  const [timeInput, setTimeInput] = useState(buildDefaultTime);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState(null);

  const fetchJourneys = useCallback(async () => {
    if (!origin.trim() || !destination.trim()) {
      setError("Origin and destination are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const route = `https://api.tfl.gov.uk/v1/Journey/JourneyResults/${encodeURIComponent(
        origin
      )}/to/${encodeURIComponent(destination)}`;
      const params = new URLSearchParams();
      const dateValue = dateInput.replace(/-/g, "");
      if (dateValue) params.append("date", dateValue);
      const timeValue = timeInput.replace(/:/g, "");
      if (timeValue) params.append("time", timeValue);
      if (appId.trim()) params.append("app_id", appId.trim());
      if (apiKey.trim()) params.append("app_key", apiKey.trim());
      const url = params.toString() ? `${route}?${params.toString()}` : route;

      const response = await fetch(url, { headers: { Accept: "application/json" } });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message = payload?.message || "TfL journey search failed.";
        throw new Error(message);
      }
      setJourneys(Array.isArray(payload?.journeys) ? payload.journeys : []);
      setLastFetched(new Date());
    } catch (fetchError) {
      console.error("Journey search error", fetchError);
      setJourneys([]);
      setError(fetchError.message || "We could not reach the journey planner.");
    } finally {
      setLoading(false);
    }
  }, [appId, apiKey, origin, destination, dateInput, timeInput]);

  const renderLeg = (leg, index) => (
    <div key={`${leg.id || index}`} style={{ marginBottom: "0.4rem" }}>
      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>{leg.mode?.name || leg.mode?.id || "Route"}</p>
      <p style={{ margin: "0.15rem 0", fontSize: "0.85rem", color: "#4b5563" }}>
        {leg.instruction?.summary || "Follow the route"}
      </p>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
        {formatLocalTime(leg.departureTime)} → {formatLocalTime(leg.arrivalTime)} · {formatDuration(leg.duration)}
      </p>
      <p style={{ margin: "0.15rem 0 0", fontSize: "0.8rem", color: "#6b7280" }}>
        Stops: {formatStops(leg.path?.stopPoints)}
      </p>
    </div>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "2rem",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h1 style={{ marginTop: 0, fontSize: "2rem" }}>Simple TfL journey planner</h1>
        <p style={{ marginTop: 0, color: "#475569" }}>
          Type in an origin and destination, pick a date/time, and the planner will show the routes and the stops each leg passes through.
        </p>

        <div
          style={{
            marginTop: "1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <label style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.85rem", color: "#475569" }}>Origin</span>
            <input
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              placeholder="e.g. King's Cross St. Pancras"
              style={{
                padding: "0.75rem",
                borderRadius: "12px",
                border: "1px solid #cbd5f5",
                marginTop: "0.4rem",
                fontSize: "1rem",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.85rem", color: "#475569" }}>Destination</span>
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="e.g. Waterloo"
              style={{
                padding: "0.75rem",
                borderRadius: "12px",
                border: "1px solid #cbd5f5",
                marginTop: "0.4rem",
                fontSize: "1rem",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.85rem", color: "#475569" }}>Date</span>
            <input
              type="date"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
              style={{
                padding: "0.75rem",
                borderRadius: "12px",
                border: "1px solid #cbd5f5",
                marginTop: "0.4rem",
                fontSize: "1rem",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.85rem", color: "#475569" }}>Time</span>
            <input
              type="time"
              value={timeInput}
              onChange={(event) => setTimeInput(event.target.value)}
              style={{
                padding: "0.75rem",
                borderRadius: "12px",
                border: "1px solid #cbd5f5",
                marginTop: "0.4rem",
                fontSize: "1rem",
              }}
            />
          </label>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <small style={{ color: "#475569" }}>App ID and API key are optional but can help if your requests are rate limited.</small>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <input
              value={appId}
              onChange={(event) => setAppId(event.target.value)}
              placeholder="TfL App ID (optional)"
              style={{
                flex: 1,
                padding: "0.65rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
              }}
            />
            <input
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="TfL API Key (optional)"
              type="password"
              style={{
                flex: 1,
                padding: "0.65rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={fetchJourneys}
          disabled={loading}
          style={{
            marginTop: "1.5rem",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "12px",
            border: "none",
            padding: "0.9rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          {loading ? "Searching journeys…" : "Search journeys"}
        </button>

        {error ? (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.8rem",
              background: "#fee2e2",
              borderRadius: "10px",
              color: "#b91c1c",
            }}
          >
            {error}
          </div>
        ) : null}

        {lastFetched ? (
          <p style={{ marginTop: "1rem", color: "#475569", fontSize: "0.85rem" }}>
            Last updated {lastFetched.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        ) : null}

        <section style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {journeys.map((journey, index) => (
            <article
              key={`${journey.startDateTime}-${index}`}
              style={{
                padding: "1rem",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{formatDuration(journey.duration)}</h3>
                <span style={{ color: "#475569", fontSize: "0.9rem" }}>
                  {formatLocalTime(journey.startDateTime)} → {formatLocalTime(journey.arrivalDateTime)}
                </span>
              </div>
              <p style={{ margin: "0.4rem 0", color: "#475569" }}>Legs: {journey.legs?.length || 0}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {(journey.legs || []).map((leg, legIndex) => renderLeg(leg, legIndex))}
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
