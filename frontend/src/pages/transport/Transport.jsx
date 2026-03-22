import { useState } from "react";

// I use this page as the main TfL journey workspace with disambiguation, save, and handoff actions.

const defaultOrigin = "London Bridge";
const defaultDestination = "King's Cross St. Pancras";

const buttonStyles = {
  padding: "0.85rem 1.5rem",
  borderRadius: "999px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
};

const suggestionButtonStyles = {
  borderRadius: "999px",
  border: "1px solid #c6d3ff",
  background: "white",
  color: "#0f4fff",
  padding: "0.35rem 1rem",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.85rem",
};

export default function TransportPage() {
  const [origin, setOrigin] = useState(defaultOrigin);
  const [destination, setDestination] = useState(defaultDestination);
  const [journey, setJourney] = useState(null);
  const [savedJourneys, setSavedJourneys] = useState([]);
  const [status, setStatus] = useState("Ready to plan your next trip.");
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [disambiguationOptions, setDisambiguationOptions] = useState({ origin: [], destination: [] });

  const encodeInput = (value) => encodeURIComponent(value.trim());

  const planJourney = async () => {
    if (!origin.trim() || !destination.trim()) {
      setStatus("Enter both an origin and a destination before planning.");
      return;
    }

    setJourneyLoading(true);
    setStatus("Looking up TfL journeys...");

    try {
      const response = await fetch(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${encodeInput(origin)}/to/${encodeInput(destination)}`
      );

      const data = await response.json();

      const normalizeOptions = (block) =>
        (block?.disambiguationOptions ?? [])
          .slice(0, 3)
          .map((option, index) => ({
            id: option.parameterValue ?? `${block?.matchStatus ?? ""}-${index}`,
            name:
              option.place?.commonName || option.place?.description || option.name || option.description ||
              option.parameterValue || `choice ${index + 1}`,
            parameterValue: option.parameterValue,
            uri: option.uri,
          }));

      const originSuggestions = normalizeOptions(data.fromLocationDisambiguation);
      const destinationSuggestions = normalizeOptions(data.toLocationDisambiguation);

      if (response.status === 300) {
        setJourney(null);
        setDisambiguationOptions({ origin: originSuggestions, destination: destinationSuggestions });
        if (originSuggestions.length || destinationSuggestions.length) {
          setStatus("TfL needs more detail. Pick one of the highlighted stops below, then tap Plan journey again.");
        } else {
          setStatus("TfL returned multiple matches for that stop—try a different query.");
        }
        return;
      }

      setDisambiguationOptions({ origin: [], destination: [] });

      if (!response.ok) {
        throw new Error("TfL returned an unexpected response");
      }

      const firstJourney = data.journeys?.[0];

      if (!firstJourney) {
        setJourney(null);
        setStatus("TfL did not return any journeys for that route.");
        return;
      }

      const normalizedJourney = { ...firstJourney, legs: firstJourney.legs ?? [] };
      setJourney(normalizedJourney);
      setStatus(`Found a ${normalizedJourney.duration}-minute journey with ${normalizedJourney.legs.length} steps.`);
    } catch (error) {
      console.error("Journey planning failed", error);
      setJourney(null);
      setStatus("Unable to plan the route right now. Try again in a moment.");
    } finally {
      setJourneyLoading(false);
    }
  };

  const handleSuggestionSelect = (target, suggestion) => {
    const displayValue = suggestion.name;
    if (target === "origin") {
      setOrigin(displayValue);
    } else {
      setDestination(displayValue);
    }
    setDisambiguationOptions((prev) => ({ ...prev, [target]: [] }));
    setJourney(null);
    setStatus(`Set ${target} to ${displayValue}. Press "Plan journey" to try again.`);
  };

  const addAndGo = () => {
    if (!journey) {
      setStatus("Plan a journey first so you know what you are adding.");
      return;
    }

    const entry = {
      id: Date.now(),
      from: origin,
      to: destination,
      duration: journey.duration,
      timestamp: new Date().toLocaleTimeString(),
    };

    setSavedJourneys((prev) => [entry, ...prev]);
    setStatus("Journey added. Opening the TfL planner so you can head there.");

    if (typeof window !== "undefined") {
      const tflUrl = `https://tfl.gov.uk/plan-a-journey/journey-results?from=${encodeInput(origin)}&to=${encodeInput(destination)}`;
      window.open(tflUrl, "_blank");
    }
  };

  return (
    <main
      role="main"
      aria-label="Transport planner"
      style={{
        minHeight: "100vh",
        padding: "3rem 1.5rem 4rem",
        background: "radial-gradient(circle at top, #e9f4ff 0%, #ffffff 70%)",
        color: "#0b1d3c",
      }}
    >
      <section
        style={{
          margin: "0 auto",
          maxWidth: "1080px",
          background: "rgba(255, 255, 255, 0.93)",
          borderRadius: "28px",
          padding: "2.8rem",
          boxShadow: "0 25px 45px rgba(9, 25, 79, 0.15)",
          border: "1px solid #e4ecff",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.3rem",
              color: "#6b7cff",
              fontSize: "0.8rem",
              margin: 0,
            }}
          >
            Transport
          </p>
          <h1 style={{ margin: "0.4rem 0 0" }}>TfL Journey Planner</h1>
          <p style={{ margin: "0.5rem 0 0", color: "#42506d" }}>
            One place for TfL recommendations and trains. Get ideas for accessible journeys, plan a route, and
            save the one you want to take.
          </p>
        </div>

        <article
          style={{
            padding: "1.8rem",
            borderRadius: "20px",
            background: "#ffffff",
            border: "1px solid #dfe8ff",
            boxShadow: "0 20px 30px rgba(9, 25, 79, 0.08)",
          }}
        >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Origin</span>
                <input
                  type="text"
                  value={origin}
                  onChange={(event) => setOrigin(event.target.value)}
                  placeholder="Where are you now?"
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: "1px solid #cbd4f5",
                    fontSize: "1rem",
                  }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Destination</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="Where do you want to go?"
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: "1px solid #cbd4f5",
                    fontSize: "1rem",
                  }}
                />
              </label>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginBottom: "1.25rem" }}>
              <button
                style={{
                  ...buttonStyles,
                  background: "#0f4fff",
                  color: "white",
                  boxShadow: "0 12px 20px rgba(15, 79, 255, 0.2)",
                }}
                onClick={planJourney}
                disabled={journeyLoading}
              >
                {journeyLoading ? "Planning..." : "Plan journey"}
              </button>

              <button
                style={{
                  ...buttonStyles,
                  background: "#fff",
                  color: "#0f4fff",
                  border: "1px solid #0f4fff",
                }}
                onClick={addAndGo}
              >
                Add & go to TfL
              </button>
            </div>

            <p style={{ color: "#4b5b78", marginTop: 0 }}>{status}</p>

            {(disambiguationOptions.origin.length > 0 || disambiguationOptions.destination.length > 0) && (
              <section
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: "14px",
                  border: "1px dashed #c7d4ff",
                  background: "rgba(198, 212, 255, 0.15)",
                }}
              >
                {disambiguationOptions.origin.length > 0 && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <p style={{ margin: "0 0 0.4rem", fontWeight: 600 }}>Origin suggestions</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {disambiguationOptions.origin.map((option) => (
                        <button
                          key={`origin-${option.id}`}
                          style={suggestionButtonStyles}
                          onClick={() => handleSuggestionSelect("origin", option)}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {disambiguationOptions.destination.length > 0 && (
                  <div>
                    <p style={{ margin: "0 0 0.4rem", fontWeight: 600 }}>Destination suggestions</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {disambiguationOptions.destination.map((option) => (
                        <button
                          key={`destination-${option.id}`}
                          style={suggestionButtonStyles}
                          onClick={() => handleSuggestionSelect("destination", option)}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {journey && (
              <section
                aria-live="polite"
                style={{
                  marginTop: "1.5rem",
                  padding: "1.5rem",
                  borderRadius: "18px",
                  background: "linear-gradient(180deg, #f4f7ff 0%, #ffffff 100%)",
                  border: "1px solid #dfe8ff",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Suggested route</h3>
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>Duration:</strong> {journey.duration} minutes
                </p>
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>Transfers:</strong> {Math.max((journey.legs?.length ?? 1) - 1, 0)}
                </p>
                <ul style={{ listStyle: "none", paddingLeft: 0, margin: "0.75rem 0 0" }}>
                  {(journey.legs || []).map((leg, index) => {
                    const departureName =
                      leg.departurePoint?.commonName || leg.instruction?.detailed || "Departure";
                    const arrivalName =
                      leg.arrivalPoint?.commonName || leg.instruction?.detailed || "Arrival";
                    const key = leg.id ?? `${leg.mode?.id ?? leg.mode?.name ?? index}-${departureName}`;

                    return (
                      <li key={key} style={{ marginBottom: "0.8rem" }}>
                        <div style={{ fontWeight: 600 }}>{leg.mode?.name || leg.instruction?.summary || "Journey"}</div>
                        <div style={{ fontSize: "0.9rem", color: "#5a647a" }}>
                          {departureName} &rarr; {arrivalName}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {savedJourneys.length > 0 && (
              <section style={{ marginTop: "1.5rem" }}>
                <h3>Saved journeys</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1rem",
                    marginTop: "0.85rem",
                  }}
                >
                  {savedJourneys.map((saved) => (
                    <article
                      key={saved.id}
                      style={{
                        padding: "1rem",
                        borderRadius: "14px",
                        border: "1px solid #dfe4ff",
                        background: "#fff",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#5c6498" }}>{saved.timestamp}</p>
                      <p style={{ margin: "0.2rem 0" }}>
                        <strong>{saved.from}</strong>
                        <br />
                        <span style={{ opacity: 0.7 }}>{saved.to}</span>
                      </p>
                      <p style={{ margin: 0, fontSize: "0.85rem" }}>~{saved.duration} mins</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </article>
      </section>
    </main>
  );
}
