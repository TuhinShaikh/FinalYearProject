import React, { useCallback, useMemo, useState } from "react";

const TIME_OPTIONS = [
  { value: "departing", label: "Departing" },
  { value: "arriving", label: "Arriving" },
];

const JOURNEY_PREFERENCES = [
  { value: "leasttime", label: "Fastest route" },
  { value: "leastinterchange", label: "Fewest interchanges" },
  { value: "leastwalking", label: "Shortest walking" },
];

const DEFAULT_MODES = "tube,overground,dlr,tram,river,train,bus";

const buildDefaultDate = () => new Date().toISOString().slice(0, 10);
const buildDefaultTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const formatDuration = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs > 0 && mins > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (hrs > 0) {
    return `${hrs}h`;
  }
  if (mins === 0) {
    return `0m`;
  }
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

export default function TransportTrainsPage() {
  const [appId, setAppId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [origin, setOrigin] = useState("Kings Cross St. Pancras");
  const [destination, setDestination] = useState("Waterloo");
  const [dateInput, setDateInput] = useState(buildDefaultDate);
  const [timeInput, setTimeInput] = useState(buildDefaultTime);
  const [timeIs, setTimeIs] = useState("departing");
  const [journeyPreference, setJourneyPreference] = useState("leasttime");
  const [modes, setModes] = useState(DEFAULT_MODES);
  const [useRealtime, setUseRealtime] = useState(true);
  const [moreAlternatives, setMoreAlternatives] = useState(true);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState(null);

  const fetchJourneys = useCallback(async () => {
    if (!origin.trim() || !destination.trim()) {
      setError("Please provide both an origin and destination.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const route = `https://api.tfl.gov.uk/v1/Journey/JourneyResults/${encodeURIComponent(
        origin
      )}/to/${encodeURIComponent(destination)}`;
      const params = new URLSearchParams();
      const cleanAppId = appId.trim();
      const cleanApiKey = apiKey.trim();
      if (cleanAppId) params.append("app_id", cleanAppId);
      if (cleanApiKey) params.append("app_key", cleanApiKey);
      const cleanedDate = dateInput.replace(/-/g, "");
      if (cleanedDate) params.append("date", cleanedDate);
      const cleanedTime = timeInput.replace(/:/g, "");
      if (cleanedTime) params.append("time", cleanedTime);
      params.append("timeIs", timeIs);
      params.append("journeyPreference", journeyPreference);
      if (modes.trim()) {
        params.append("mode", modes.trim());
      }
      if (useRealtime) {
        params.append("useRealtime", "true");
        params.append("maxChanges", "4");
      }
      if (moreAlternatives) {
        params.append("alternativeCycleJourney", "true");
        params.append("alternativeWalking", "true");
      }

      const url = `${route}?${params.toString()}`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message = payload?.message || "TfL journey search failed.";
        throw new Error(message);
      }
      const plan = Array.isArray(payload?.journeys) ? payload.journeys : [];
      setJourneys(plan);
      setLastFetched(new Date());
    } catch (fetchError) {
      console.error("Journey search error", fetchError);
      setJourneys([]);
      setError(fetchError.message || "Unable to reach the TfL journey planner right now.");
    } finally {
      setLoading(false);
    }
  }, [appId, apiKey, origin, destination, dateInput, timeInput, timeIs, journeyPreference, modes, useRealtime, moreAlternatives]);

  const summary = useMemo(() => {
    if (!journeys.length) return null;
    const durations = journeys.map((journey) => journey.duration || 0).sort((a, b) => a - b);
    const fastest = durations[0];
    const slowest = durations[durations.length - 1];
    return {
      fastest,
      slowest,
      alternatives: Math.max(0, journeys.length - 1),
    };
  }, [journeys]);

  const featured = journeys[0];

  const planeInfo = useMemo(() => {
    if (!journeys.length) return [];
    return journeys.flatMap((journey) => journey.legs || []).map((leg) => leg.mode?.name || leg.mode?.id || "Unknown");
  }, [journeys]);

  const uniqueModes = [...new Set(planeInfo)].filter(Boolean);

  const renderLeg = (leg, index) => {
    const header = leg.mode?.name || leg.mode?.id || leg.instruction?.summary || "Leg";
    return (
      <div key={`${leg.id || header}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", padding: "0.4rem 0" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>{header}</p>
          <p style={{ margin: "0.15rem 0", fontSize: "0.85rem", color: "#a5b6cf" }}>
            {leg.instruction?.summary || "Follow the route"}
          </p>
          {leg.departureTime && leg.arrivalTime ? (
            <p style={{ margin: 0, fontSize: "0.8rem" }}>
              {formatLocalTime(leg.departureTime)} → {formatLocalTime(leg.arrivalTime)}
            </p>
          ) : null}
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.8rem", color: "#15bffc" }}>{formatDuration(leg.duration)}</span>
        </div>
      </div>
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(180deg, #030b18 0%, #0a1a2d 55%, #111f3c 100%)",
        color: "#f6fbff",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      <section
        style={{
          borderRadius: "24px",
          padding: "2.5rem",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "radial-gradient(circle at top left, rgba(21, 125, 255, 0.5), transparent 45%), rgba(3, 11, 24, 0.9)",
          boxShadow: "0 30px 60px rgba(2, 7, 16, 0.65)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "30px",
            borderRadius: "20px",
            border: "1px dashed rgba(255, 255, 255, 0.2)",
            pointerEvents: "none",
          }}
        />
        <p style={{ margin: 0, fontSize: "0.9rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#a3d0ff" }}>
          Transport / Trains
        </p>
        <h1 style={{ margin: "1rem 0 0.5rem", fontSize: "3.2rem", lineHeight: 1.1 }}>TfL journey planner</h1>
        <p style={{ margin: 0, maxWidth: "640px", color: "#c9d6f9", lineHeight: 1.6 }}>
          Tap into the Transport for London Unified API to explore the next journeys covering trains, tubes, DLR, buses, trams, and river services.
          Supply your TfL credentials and the coordinates behind the scenes will deliver honest, real-time options.
        </p>
      </section>

      <section
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {[{ label: "App ID", value: appId, onChange: setAppId, placeholder: "e.g. my-app-id", type: "text" },
          { label: "API Key", value: apiKey, onChange: setApiKey, placeholder: "e.g. secret-key", type: "password" }].map((field) => (
          <label
            key={field.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              padding: "1.2rem",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "#98a7cc" }}>{field.label}</span>
            <input
              type={field.type}
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              placeholder={field.placeholder}
              style={{
                padding: "0.65rem 0.85rem",
                borderRadius: "999px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "transparent",
                color: "#f6fbff",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            />
            <small style={{ color: "#7791b9" }}>Thumbs up for secure keys saved in your browser.</small>
          </label>
        ))}
      </section>

      <section
        style={{
          marginTop: "1.5rem",
          padding: "1.8rem",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {[{ label: "Origin", state: origin, setter: setOrigin, placeholder: "Id or free text" },
          { label: "Destination", state: destination, setter: setDestination, placeholder: "Id or free text" }].map((field) => (
          <label key={field.label} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#bcd0ff" }}>{field.label}</span>
            <input
              value={field.state}
              onChange={(event) => field.setter(event.target.value)}
              placeholder={field.placeholder}
              style={{
                borderRadius: "999px",
                border: "1px solid rgba(255, 255, 255, 0.24)",
                padding: "0.7rem 1rem",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#f6fbff",
                fontWeight: 600,
              }}
            />
          </label>
        ))}

        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#bcd0ff" }}>Date</span>
          <input
            type="date"
            value={dateInput}
            onChange={(event) => setDateInput(event.target.value)}
            style={{
              borderRadius: "999px",
              border: "1px solid rgba(255, 255, 255, 0.24)",
              padding: "0.7rem 1rem",
              background: "rgba(255, 255, 255, 0.04)",
              color: "#f6fbff",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#bcd0ff" }}>Time</span>
          <input
            type="time"
            value={timeInput}
            onChange={(event) => setTimeInput(event.target.value)}
            style={{
              borderRadius: "999px",
              border: "1px solid rgba(255, 255, 255, 0.24)",
              padding: "0.7rem 1rem",
              background: "rgba(255, 255, 255, 0.04)",
              color: "#f6fbff",
            }}
          />
        </label>
      </section>

      <section
        style={{
          marginTop: "1rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#9fb4d4" }}>Time is</span>
            <select
              value={timeIs}
              onChange={(event) => setTimeIs(event.target.value)}
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#f6fbff",
                padding: "0.55rem 0.75rem",
                minWidth: "140px",
              }}
            >
              {TIME_OPTIONS.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#9fb4d4" }}>Preference</span>
            <select
              value={journeyPreference}
              onChange={(event) => setJourneyPreference(event.target.value)}
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#f6fbff",
                padding: "0.55rem 0.75rem",
                minWidth: "200px",
              }}
            >
              {JOURNEY_PREFERENCES.map((preference) => (
                <option value={preference.value} key={preference.value}>
                  {preference.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: "220px" }}>
            <span style={{ fontSize: "0.75rem", color: "#9fb4d4" }}>Modes (comma separated)</span>
            <input
              value={modes}
              onChange={(event) => setModes(event.target.value)}
              placeholder={DEFAULT_MODES}
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#f6fbff",
                padding: "0.55rem 0.75rem",
                minWidth: "220px",
              }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <input type="checkbox" checked={useRealtime} onChange={(event) => setUseRealtime(event.target.checked)} />
            <span style={{ fontSize: "0.8rem" }}>Use real-time data</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <input
              type="checkbox"
              checked={moreAlternatives}
              onChange={(event) => setMoreAlternatives(event.target.checked)}
            />
            <span style={{ fontSize: "0.8rem" }}>Show more alternatives</span>
          </label>
        </div>

        <button
          onClick={fetchJourneys}
          disabled={loading}
          style={{
            marginLeft: "auto",
            padding: "0.75rem 1.8rem",
            borderRadius: "999px",
            border: "none",
            background: "linear-gradient(100deg, #fcd34d, #fb923c)",
            boxShadow: "0 12px 20px rgba(251, 146, 60, 0.35)",
            color: "#0c1222",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Searching…" : "Search TfL journeys"}
        </button>
      </section>

      {error ? (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem 1.2rem",
            borderRadius: "14px",
            background: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.35)",
            color: "#ffb3c6",
          }}
        >
          <strong>Unable to search:</strong> {error}
        </div>
      ) : null}

      {lastFetched ? (
        <p style={{ marginTop: "0.9rem", color: "#9fb4d4" }}>
          Last updated {lastFetched.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
      ) : null}

      <section
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        <article
          style={{
            padding: "1.2rem",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#86a6cf" }}>Journeys returned</p>
          <h3 style={{ margin: "0.4rem 0", fontSize: "1.8rem" }}>{journeys.length}</h3>
          <p style={{ margin: 0, color: "#b7c6dd" }}>Realtime optimism: {useRealtime ? "Enabled" : "Off"}</p>
        </article>

        {summary ? (
          <article
            style={{
              padding: "1.2rem",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#86a6cf" }}>Fastest journey</p>
            <h3 style={{ margin: "0.4rem 0", fontSize: "1.8rem" }}>{formatDuration(summary.fastest)}</h3>
            <p style={{ margin: 0, color: "#b7c6dd" }}>Slowest: {formatDuration(summary.slowest)}</p>
            <p style={{ margin: "0.35rem 0 0", color: "#b7c6dd" }}>Alternatives: {summary.alternatives}</p>
          </article>
        ) : null}

        {uniqueModes.length ? (
          <article
            style={{
              padding: "1.2rem",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#86a6cf" }}>Modes captured</p>
            <h3 style={{ margin: "0.4rem 0", fontSize: "1.2rem" }}>{uniqueModes.join(" • ")}</h3>
          </article>
        ) : null}
      </section>

      {featured ? (
        <section
          style={{
            marginTop: "2rem",
            borderRadius: "20px",
            padding: "1.8rem",
            background: "linear-gradient(135deg, #f97316 0%, #fb923c 55%, #fcd34d 100%)",
            color: "#0b1120",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Featured journey
          </p>
          <h2 style={{ margin: "0.6rem 0", fontSize: "2.4rem" }}>{formatDuration(featured.duration)}</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <p style={{ margin: 0 }}>
              {formatLocalTime(featured.startDateTime)} → {formatLocalTime(featured.arrivalDateTime)}
            </p>
            <p style={{ margin: 0 }}>Legs: {featured.legs?.length || 0}</p>
            <p style={{ margin: 0 }}>Preference: {journeyPreference}</p>
          </div>
        </section>
      ) : null}

      <section
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {journeys.map((journey, index) => (
          <article
            key={`${journey.startDateTime}-${journey.duration}-${index}`}
            style={{
              padding: "1.3rem",
              borderRadius: "18px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.4rem" }}>{formatDuration(journey.duration)}</h3>
              <p style={{ margin: 0, color: "#a1b3d5" }}>
                {formatLocalTime(journey.startDateTime)} → {formatLocalTime(journey.arrivalDateTime)}
              </p>
            </div>
            <p style={{ margin: "0.4rem 0", color: "#b7c6dd" }}>Legs: {journey.legs?.length || 0}</p>
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "0.4rem", paddingTop: "0.6rem" }}>
              {(journey.legs || []).slice(0, 3).map((leg, legIndex) => renderLeg(leg, legIndex))}
              {journey.legs?.length > 3 ? (
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", color: "#8aa2c7" }}>
                  +{journey.legs.length - 3} more legs
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}