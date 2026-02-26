import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const stationSuggestions = ["LST", "CAM", "NOR", "IPW", "SST", "COL", "BHM"];

export default function JourneyPlannerPage() {
  const [stationInput, setStationInput] = useState("LST");
  const [activeStation, setActiveStation] = useState("LST");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const loadTrains = useCallback(async (targetStation) => {
    if (!targetStation) {
      setError("Enter a CRS code to begin tracking a station.");
      return;
    }
    setLoading(true);
    setError("");
    setStatusMessage("Refreshing live departures…");
    try {
      const res = await axios.get("/api/trains/greater-anglia", {
      if (services.length === 0) {
        setStatusMessage("No services reported for that station right now.");
      } else {
        setStatusMessage(
          `${services.length} live service${services.length === 1 ? "" : "s"} loaded.`,
        );
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching trains", err);
      setTrains([]);
      setError("Unable to reach Greater Anglia right now. Please try again shortly.");
      setStatusMessage("Live departures could not be refreshed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrains(activeStation);
  }, [activeStation, loadTrains]);

  useEffect(() => {
    const interval = setInterval(() => loadTrains(activeStation), 45000);
    return () => clearInterval(interval);
  }, [activeStation, loadTrains]);

  const summary = useMemo(() => {
    const result = { onTime: 0, delayed: 0, cancelled: 0 };
    trains.forEach((service) => {
      const status = (service.status || service.etd || "").toString().toLowerCase();
      if (status.includes("can")) {
        result.cancelled += 1;
      } else if (status.includes("delay") || status.includes("late")) {
        result.delayed += 1;
      } else {
        result.onTime += 1;
      }
    });
    return result;
  }, [trains]);

  const destinationLabel = (service) => {
    const destinations = Array.isArray(service.destination) ? service.destination : [];
    if (destinations.length) {
      return destinations
        .map((d) => d?.locationName || d?.name)
        .filter(Boolean)
        .join(" • ") || "Unknown destination";
    }
    return "Destination unknown";
  };

  const highlighted = trains[0];
  const formatTime = (value) => value || "—";

  return (
    <main
      style={{
        padding: "2rem",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eef4ff 0%, #ffffff 70%)",
        color: "#0a1f3d",
      }}
    >
      <section
        style={{
          backdropFilter: "blur(18px)",
          padding: "2rem",
          borderRadius: "20px",
          border: "1px solid rgba(10, 31, 61, 0.1)",
          boxShadow: "0 30px 45px rgba(10, 31, 61, 0.15)",
          background: "linear-gradient(135deg, rgba(59, 155, 255, 0.1), rgba(255, 255, 255, 0.95))",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#1c4ca8" }}>
          Greater Anglia
        </p>
        <h1 style={{ margin: "0.4rem 0 0.8rem", fontSize: "2.5rem" }}>Live train departures</h1>
        <p style={{ margin: 0, maxWidth: "640px", lineHeight: 1.6 }}>
          Enter the CRS code for any Greater Anglia station to view the next departures tracked from the official API.
          The data here now mirrors what our backend receives from the provider, so times are honest and current.
        </p>
        <div
          style={{
            marginTop: "1.4rem",
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <input
              list="station-options"
              value={stationInput}
              onChange={(e) => setStationInput(e.target.value.toUpperCase())}
              aria-label="Station CRS code"
              placeholder="Station CRS"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "999px",
                border: "1px solid rgba(10, 31, 61, 0.2)",
                maxWidth: "180px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            />
            <datalist id="station-options">
              {stationSuggestions.map((code) => (
                <option value={code} key={code} />
              ))}
            </datalist>
          </div>
          <button
            onClick={() => {
              const normalized = stationInput.trim().toUpperCase();
              if (normalized) {
                setActiveStation(normalized);
              }
            }}
            disabled={loading}
            style={{
              padding: "0.75rem 1.8rem",
              borderRadius: "999px",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              background: "#0a1f3d",
              color: "white",
              boxShadow: "0 12px 18px rgba(10, 31, 61, 0.25)",
            }}
          >
            {loading ? "Refreshing …" : "Check departures"}
          </button>
          <span style={{ fontWeight: 600, color: "#0a1f3d" }}>
            {statusMessage}
          </span>
        </div>
        <p style={{ marginTop: "0.3rem", fontSize: "0.9rem", color: "#445673" }}>
          {lastUpdated && `Last updated at ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}
        </p>
      </section>

      <section
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        {[
          { label: "On time", value: summary.onTime, color: "#1d7a32" },
          { label: "Delayed", value: summary.delayed, color: "#b00020" },
          { label: "Cancelled", value: summary.cancelled, color: "#ff6b4a" },
        ].map((panel) => (
          <article
            key={panel.label}
            style={{
              padding: "1.1rem",
              borderRadius: "12px",
              background: "white",
              border: "1px solid rgba(10, 31, 61, 0.1)",
              boxShadow: "0 15px 25px rgba(10, 31, 61, 0.07)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.85rem", color: panel.color }}>{panel.label}</p>
            <p style={{ margin: "0.4rem 0 0", fontSize: "1.9rem", fontWeight: 600 }}>{panel.value}</p>
          </article>
        ))}
      </section>

      {error ? (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem 1.2rem",
            background: "rgba(255, 235, 238, 0.95)",
            borderRadius: "12px",
            border: "1px solid rgba(220, 0, 55, 0.2)",
            color: "#b00020",
          }}
        >
          <strong>Heads up:</strong> {error}
        </div>
      ) : null}

      <section style={{ marginTop: "1.8rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Departures from {activeStation}</h2>
          <button
            onClick={() => loadTrains(activeStation)}
            disabled={loading}
            style={{
              border: "1px solid rgba(10, 31, 61, 0.25)",
              background: "transparent",
              borderRadius: "999px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              color: "#0a1f3d",
            }}
          >
            Refresh now
          </button>
        </div>

        {loading && !trains.length ? (
          <p style={{ marginTop: "0.6rem" }}>Loading live departures …</p>
        ) : null}

        {!loading && trains.length === 0 && !error ? (
          <p style={{ marginTop: "0.6rem", color: "#3b4a67" }}>
            No departures loaded yet. Change the CRS code above or tap refresh once more.
          </p>
        ) : null}

        {highlighted && (
          <article
            style={{
              padding: "1.5rem",
              marginTop: "1rem",
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(59,155,255,0.12))",
              border: "1px solid rgba(10, 31, 61, 0.12)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.8rem", letterSpacing: "0.08em", fontWeight: 600, color: "#0a1f3d" }}>
              Next service
            </p>
            <h3 style={{ margin: "0.3rem 0", fontSize: "2rem" }}>{destinationLabel(highlighted)}</h3>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "1.1rem" }}>
              <span>
                <strong>Scheduled:</strong> {formatTime(highlighted.std)}
              </span>
              <span>
                <strong>Expected:</strong> {formatTime(highlighted.etd)}
              </span>
              {highlighted.platform ? (
                <span>
                  <strong>Platform:</strong> {highlighted.platform}
                </span>
              ) : null}
              {highlighted.operator ? (
                <span>
                  <strong>Operator:</strong> {highlighted.operator}
                </span>
              ) : null}
            </div>
          </article>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.2rem",
            marginTop: "1rem",
          }}
        >
          {trains.map((service, index) => (
            <article
              key={`${service.std}-${destinationLabel(service)}-${index}`}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                background: "white",
                border: "1px solid rgba(10, 31, 61, 0.08)",
                boxShadow: "0 10px 18px rgba(10, 31, 61, 0.08)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{destinationLabel(service)}</h3>
              <p style={{ margin: "0.4rem 0", color: "#516088" }}>
                {service.status ? service.status : formatTime(service.etd)}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                <span>
                  <strong>STD</strong>
                  <br />
                  {formatTime(service.std)}
                </span>
                <span>
                  <strong>ETD</strong>
                  <br />
                  {formatTime(service.etd)}
                </span>
                <span>
                  <strong>Platform</strong>
                  <br />
                  {service.platform || "—"}
                </span>
              </div>
              {service.operator ? (
                <p style={{ marginTop: "0.7rem", fontSize: "0.85rem", color: "#1c4ca8" }}>
                  Operated by {service.operator}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const stationSuggestions = ["LST", "CAM", "NOR", "IPW", "SST", "COL", "BHM"];

export default function JourneyPlannerPage() {
  const [stationInput, setStationInput] = useState("LST");
  const [activeStation, setActiveStation] = useState("LST");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const loadTrains = useCallback(async (targetStation) => {
    if (!targetStation) {
      setError("Enter a CRS code to begin tracking a station.");
      return;
    }
    setLoading(true);
    setError("");
    setStatusMessage("Refreshing live departures…");
    try {
      const res = await axios.get("/api/trains/greater-anglia", {
        params: { station: targetStation },
      });
      const services = Array.isArray(res.data?.trainServices) ? res.data.trainServices : [];
      setTrains(services);
      if (services.length === 0) {
        setStatusMessage("No services reported for that station right now.");
      } else {
        setStatusMessage(
          `${services.length} live service${services.length === 1 ? "" : "s"} loaded.`,
        );
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching trains", err);
      setTrains([]);
      setError("Unable to reach Greater Anglia right now. Please try again shortly.");
      setStatusMessage("Live departures could not be refreshed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrains(activeStation);
  }, [activeStation, loadTrains]);

  useEffect(() => {
    const interval = setInterval(() => loadTrains(activeStation), 45000);
    return () => clearInterval(interval);
  }, [activeStation, loadTrains]);

  const summary = useMemo(() => {
    const result = { onTime: 0, delayed: 0, cancelled: 0 };
    trains.forEach((service) => {
      const status = (service.status || service.etd || "").toString().toLowerCase();
      if (status.includes("can")) {
        result.cancelled += 1;
      } else if (status.includes("delay") || status.includes("late")) {
        result.delayed += 1;
      } else {
        result.onTime += 1;
      }
    });
    return result;
  }, [trains]);

  const destinationLabel = (service) => {
    const destinations = Array.isArray(service.destination) ? service.destination : [];
    if (destinations.length) {
      return destinations
        .map((d) => d?.locationName || d?.name)
        .filter(Boolean)
        .join(" • ") || "Unknown destination";
    }
    return "Destination unknown";
  };

  const highlighted = trains[0];
  const formatTime = (value) => value || "—";

  return (
    <main
      style={{
        padding: "2rem",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eef4ff 0%, #ffffff 70%)",
        color: "#0a1f3d",
      }}
    >
      <section
        style={{
          backdropFilter: "blur(18px)",
          padding: "2rem",
          borderRadius: "20px",
          border: "1px solid rgba(10, 31, 61, 0.1)",
          boxShadow: "0 30px 45px rgba(10, 31, 61, 0.15)",
          background: "linear-gradient(135deg, rgba(59, 155, 255, 0.1), rgba(255, 255, 255, 0.95))",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#1c4ca8" }}>
          Greater Anglia</p>
        <h1 style={{ margin: "0.4rem 0 0.8rem", fontSize: "2.5rem" }}>Live train departures</h1>
        <p style={{ margin: 0, maxWidth: "640px", lineHeight: 1.6 }}>
          Enter the CRS code for any Greater Anglia station to view the next departures tracked from the official API.
          The data here now mirrors what our backend receives from the provider, so times are honest and current.
        </p>
        <div
          style={{
            marginTop: "1.4rem",
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <input
              list="station-options"
              value={stationInput}
              onChange={(e) => setStationInput(e.target.value.toUpperCase())}
              aria-label="Station CRS code"
              placeholder="Station CRS"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "999px",
                border: "1px solid rgba(10, 31, 61, 0.2)",
                maxWidth: "180px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            />
            <datalist id="station-options">
              {stationSuggestions.map((code) => (
                <option value={code} key={code} />
              ))}
            </datalist>
          </div>
          <button
            onClick={() => {
              const normalized = stationInput.trim().toUpperCase();
              if (normalized) {
                setActiveStation(normalized);
              }
            }}
            disabled={loading}
            style={{
              padding: "0.75rem 1.8rem",
              borderRadius: "999px",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              background: "#0a1f3d",
              color: "white",
              boxShadow: "0 12px 18px rgba(10, 31, 61, 0.25)",
            }}
          >
            {loading ? "Refreshing …" : "Check departures"}
          </button>
          <span style={{ fontWeight: 600, color: "#0a1f3d" }}>
            {statusMessage}
          </span>
        </div>
        <p style={{ marginTop: "0.3rem", fontSize: "0.9rem", color: "#445673" }}>
          {lastUpdated && `Last updated at ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}
        </p>
      </section>

      <section
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        {[
          { label: "On time", value: summary.onTime, color: "#1d7a32" },
          { label: "Delayed", value: summary.delayed, color: "#b00020" },
          { label: "Cancelled", value: summary.cancelled, color: "#ff6b4a" },
        ].map((panel) => (
          <article
            key={panel.label}
            style={{
              padding: "1.1rem",
              borderRadius: "12px",
              background: "white",
              border: "1px solid rgba(10, 31, 61, 0.1)",
              boxShadow: "0 15px 25px rgba(10, 31, 61, 0.07)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.85rem", color: panel.color }}>{panel.label}</p>
            <p style={{ margin: "0.4rem 0 0", fontSize: "1.9rem", fontWeight: 600 }}>{panel.value}</p>
          </article>
        ))}
      </section>

      {error ? (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem 1.2rem",
            background: "rgba(255, 235, 238, 0.95)",
            borderRadius: "12px",
            border: "1px solid rgba(220, 0, 55, 0.2)",
            color: "#b00020",
          }}
        >
          <strong>Heads up:</strong> {error}
        </div>
      ) : null}

      <section style={{ marginTop: "1.8rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Departures from {activeStation}</h2>
          <button
            onClick={() => loadTrains(activeStation)}
            disabled={loading}
            style={{
              border: "1px solid rgba(10, 31, 61, 0.25)",
              background: "transparent",
              borderRadius: "999px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              color: "#0a1f3d",
            }}
          >
            Refresh now
          </button>
        </div>

        {loading && !trains.length ? (
          <p style={{ marginTop: "0.6rem" }}>Loading live departures …</p>
        ) : null}

        {!loading && trains.length === 0 && !error ? (
          <p style={{ marginTop: "0.6rem", color: "#3b4a67" }}>
            No departures loaded yet. Change the CRS code above or tap refresh once more.
          </p>
        ) : null}

        {highlighted && (
          <article
            style={{
              padding: "1.5rem",
              marginTop: "1rem",
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(59,155,255,0.12))",
              border: "1px solid rgba(10, 31, 61, 0.12)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.8rem", letterSpacing: "0.08em", fontWeight: 600, color: "#0a1f3d" }}>
              Next service
            </p>
            <h3 style={{ margin: "0.3rem 0", fontSize: "2rem" }}>{destinationLabel(highlighted)}</h3>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "1.1rem" }}>
              <span>
                <strong>Scheduled:</strong> {formatTime(highlighted.std)}
              </span>
              <span>
                <strong>Expected:</strong> {formatTime(highlighted.etd)}
              </span>
              {highlighted.platform ? (
                <span>
                  <strong>Platform:</strong> {highlighted.platform}
                </span>
              ) : null}
              {highlighted.operator ? (
                <span>
                  <strong>Operator:</strong> {highlighted.operator}
                </span>
              ) : null}
            </div>
          </article>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.2rem",
            marginTop: "1rem",
          }}
        >
          {trains.map((service, index) => (
            <article
              key={`${service.std}-${destinationLabel(service)}-${index}`}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                background: "white",
                border: "1px solid rgba(10, 31, 61, 0.08)",
                boxShadow: "0 10px 18px rgba(10, 31, 61, 0.08)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{destinationLabel(service)}</h3>
              <p style={{ margin: "0.4rem 0", color: "#516088" }}>
                {service.status ? service.status : formatTime(service.etd)}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                <span>
                  <strong>STD</strong>
                  <br />
                  {formatTime(service.std)}
                </span>
                <span>
                  <strong>ETD</strong>
                  <br />
                  {formatTime(service.etd)}
                </span>
                <span>
                  <strong>Platform</strong>
                  <br />
                  {service.platform || "—"}
                </span>
              </div>
              {service.operator ? (
                <p style={{ marginTop: "0.7rem", fontSize: "0.85rem", color: "#1c4ca8" }}>
                  Operated by {service.operator}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function JourneyPlannerPage() {
  const [station, setStation] = useState("LST");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadTrains = useCallback(async (targetStation) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/trains/greater-anglia", {
        params: { station: targetStation },
      });

      setTrains(res.data.trainServices || []);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.error("Error fetching trains", err);
      setError("Unable to reach Greater Anglia right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrains(station);
  }, [loadTrains, station]);

  useEffect(() => {
    const interval = setInterval(() => loadTrains(station), 45000);
    return () => clearInterval(interval);
  }, [loadTrains, station]);

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
      {lastUpdated && (
        <p style={{ fontSize: "0.9rem", marginTop: "0.2rem", color: "#445673" }}>
          Last updated at {lastUpdated}
        </p>
      )}

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