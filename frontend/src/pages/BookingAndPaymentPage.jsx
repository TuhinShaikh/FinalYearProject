import React, { useMemo, useState, useEffect, useRef } from "react";
import "../App.css";
import logo from "../assets/image.jpg";

// I designed this page to combine slot discovery and checkout so matchday booking stays in one smooth flow.

const weatherScenarios = [
  {
    icon: "☀️",
    label: "Late winter sun",
    description: "Clear skies, ideal for quick drop-offs",
    temp: 11,
    wind: "6 km/h NE",
  },
  {
    icon: "🌧️",
    label: "Light drizzle",
    description: "Wet surfaces—mind the puddles",
    temp: 9,
    wind: "11 km/h SW",
  },
  {
    icon: "🌬️",
    label: "Brisk breeze",
    description: "Gusts keep the air moving",
    temp: 8,
    wind: "18 km/h W",
  },
];

const statusLabelMap = {
  available: "Open now",
  occupied: "Recently used",
  maintenance: "Blocked for cleaning",
};

const statusHighlights = {
  available: "#8bc8ff",
  occupied: "#9ea7b8",
  maintenance: "#f2c1c1",
};

const filterOptions = [
  { key: "all", label: "Show every space" },
  { key: "available", label: "Only open spaces" },
  { key: "occupied", label: "Recently used" },
  { key: "maintenance", label: "Blocked" },
];

let squareSdkPromise;

function loadSquareSdk() {
  // I cache this promise so I never load the Square script twice during one visit.
  if (squareSdkPromise) return squareSdkPromise;

  squareSdkPromise = new Promise((resolve, reject) => {
    if (window.Square) {
      resolve();
      return;
    }

    const existingScript = document.getElementById("square-sdk");
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener(
        "error",
        () => {
          squareSdkPromise = null;
          reject(new Error("Square SDK failed to load"));
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "square-sdk";
    script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
    script.onload = () => resolve();
    script.onerror = () => {
      squareSdkPromise = null;
      reject(new Error("Square SDK failed to load"));
    };
    document.head.appendChild(script);
  });

  return squareSdkPromise;
}

function createSlots() {
  // I generate a realistic spread of prices/statuses so the booking screen feels like a live lot.
  return Array.from({ length: 100 }, (_, idx) => {
    const id = idx + 1;
    let price = 15;

    if (id === 1) price = 100;
    else if (id <= 20) price = 50;
    else if (id <= 60) price = 40;
    else if (id <= 80) price = 20;

    const random = Math.random();
    let status = "available";
    let reason = "Spot ready in 2m";

    if (random < 0.25) {
      status = "occupied";
      reason = "Recently departed—give it a moment";
    } else if (random < 0.4) {
      status = "maintenance";
      reason = "AI flagged it for cleaning";
    }

    return { id, price, status, reason };
  });
}

function applyAiBlocks(slots) {
  // I add a random maintenance pattern to simulate AI safety checks on specific bays.
  const blocked = new Set();
  const patternSize = 6 + Math.floor(Math.random() * 6);

  while (blocked.size < patternSize) {
    blocked.add(Math.floor(Math.random() * slots.length));
  }

  return slots.map((slot, index) => {
    if (blocked.has(index)) {
      return {
        ...slot,
        status: "maintenance",
        reason: "AI blocked for sanitisation",
      };
    }

    return slot;
  });
}

function countStatuses(slots) {
  // I compute compact counters so filter chips can show live totals beside each status.
  return slots.reduce(
    (acc, slot) => {
      acc[slot.status] = (acc[slot.status] ?? 0) + 1;
      return acc;
    },
    {
      available: 0,
      occupied: 0,
      maintenance: 0,
    }
  );
}

export default function BookingAndPaymentPage() {
  // I generate and freeze the AI slot pattern once per page load.
  const [slots] = useState(() => applyAiBlocks(createSlots()));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("");
  const [cardLoading, setCardLoading] = useState(false);

  const cardRef = useRef(null);

  const filteredSlots = useMemo(() => {
    if (filter === "all") return slots;
    return slots.filter((slot) => slot.status === filter);
  }, [filter, slots]);

  const slotCounts = useMemo(() => countStatuses(slots), [slots]);

  const weather = weatherScenarios[0];

  const statusColor = useMemo(() => {
    if (!status) return "#1c3152";
    if (status.startsWith("❌")) return "#b00020";
    if (status.startsWith("✅")) return "#0a1f3d";
    return "#1c3152";
  }, [status]);

  const handleSlotSelect = (slot) => {
    // I only allow checkout from available slots so users cannot pay for blocked/occupied bays.
    if (slot.status !== "available") {
      setStatus(
        `❌ Slot ${slot.id} is ${statusLabelMap[slot.status]}; pick another space.`
      );
      return;
    }

    setSelectedSlot(slot);
    setStatus(`✅ Slot ${slot.id} reserved for you. Proceed to checkout.`);
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!selectedSlot) {
      setStatus("❌ Please select a parking slot first.");
      return;
    }

    if (!cardRef.current) {
      setStatus("❌ Payment field is still loading; hold tight.");
      return;
    }

    try {
      // Tokenization happens in the browser; backend only receives a safe token + amount.
      const result = await cardRef.current.tokenize();

      if (result.status !== "OK") {
        setStatus(
          "❌ Payment failed: " +
            (result.errors?.[0]?.message ?? "tokenization declined")
        );
        return;
      }

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: result.token,
          amount: selectedSlot.price,
          slotId: selectedSlot.id,
        }),
      });

      const data = await response.json();
      setStatus("✅ Payment successful! " + (data.message ?? "Thank you."));
    } catch (error) {
      setStatus("❌ Payment error: " + (error?.message ?? error));
    }
  };

  useEffect(() => {
    // I recreate the card widget whenever the selected slot changes so old payment state is cleared.
    const teardown = () => {
      try {
        if (cardRef.current?.destroy) cardRef.current.destroy();
      } catch {
        // ignore errors during teardown
      } finally {
        cardRef.current = null;
      }

      const el = document.getElementById("card-container");
      if (el) el.innerHTML = "";
    };

    if (!selectedSlot) {
      teardown();
      return;
    }

    let cancelled = false;

    teardown();
    setStatus("");
    setCardLoading(true);

    (async () => {
      try {
        await loadSquareSdk();
        if (cancelled || !window.Square) return;

        const payments = window.Square.payments(
          "sandbox-sq0idb-I-lZ-tkY-jzemSkWMfBn-A"
        );

        const card = await payments.card();

        if (cancelled) {
          if (card?.destroy) card.destroy();
          return;
        }

        await card.attach("#card-container");

        if (cancelled) {
          if (card?.destroy) card.destroy();
          return;
        }

        cardRef.current = card;
      } catch (error) {
        if (!cancelled) {
          setStatus("❌ Error initializing Square: " + (error?.message ?? error));
        }
      } finally {
        if (!cancelled) setCardLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      teardown();
    };
  }, [selectedSlot]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(180deg, #e7f4ff 0%, #ffffff 70%)",
        color: "#0a1f3d",
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={{ letterSpacing: "0.3em", fontSize: "0.75rem", color: "#6b7892" }}>
            PARKING HQ
          </p>
          <h1 style={{ margin: "0.3rem 0" }}>Book a space, pay with confidence</h1>
          <p style={{ maxWidth: "480px", color: "#354364" }}>
            AI monitors the lot, updates slot status in real time, and lets you lock in
            premium spaces without the wait.
          </p>
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
        <div
          style={{
            background: "#fff",
            padding: "1.25rem",
            borderRadius: "18px",
            boxShadow: "0 15px 45px rgba(15, 110, 246, 0.08)",
          }}
        >
          <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.4em", color: "#7c88a5" }}>
            Filters
          </p>
          <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {filterOptions.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                // These buttons let users focus quickly on available vs blocked spaces.
                onClick={() => setFilter(key)}
                style={{
                  padding: "0.5rem 0.9rem",
                  borderRadius: "999px",
                  border: filter === key ? "1px solid #0f6ef6" : "1px solid #d5daef",
                  background: filter === key ? "#edf3ff" : "#f7f8ff",
                  color: "#0a1f3d",
                  cursor: "pointer",
                  fontWeight: filter === key ? 600 : 500,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: "1.25rem",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "0.5rem",
            }}
          >
            {Object.entries(slotCounts).map(([key, count]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.45rem 0.8rem",
                  borderRadius: "10px",
                  background: "#f6f8ff",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: statusHighlights[key],
                  }}
                />
                <span style={{ fontSize: "0.8rem", color: "#1c2a4a" }}>
                  {key}
                </span>
                <strong style={{ fontSize: "0.9rem" }}>{count}</strong>
              </div>
            ))}
          </div>

          <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#527194" }}>
            AI predicts several slots are temporarily busy—reshuffle to see a different block pattern.
          </p>
        </div>

        <div
          style={{
            background: "#0a1f3d",
            color: "#fff",
            borderRadius: "18px",
            padding: "1.5rem",
            boxShadow: "0 25px 40px rgba(10, 31, 61, 0.3)",
          }}
        >
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.7 }}>
            Weather forecast
          </p>
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "2.5rem" }} aria-hidden="true">
              {weather.icon}
            </span>
            <div>
              <h3 style={{ margin: 0 }}>{weather.label}</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>{weather.description}</p>
            </div>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
            <span>{weather.temp}°C</span>
            <span>{weather.wind} wind</span>
          </div>
          <p style={{ marginTop: "0.8rem", fontSize: "0.75rem", opacity: 0.7 }}>
            Forecast refreshed for the current session.
          </p>
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Choose a slot</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.8rem",
          }}
        >
          {filteredSlots.length === 0 ? (
            <p style={{ gridColumn: "1 / -1", color: "#1c2a4a" }}>
              No slots match that filter yet. Try "Show every space" or reshuffle the lot.
            </p>
          ) : (
            filteredSlots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isAvailable = slot.status === "available";

              return (
                <button
                  key={slot.id}
                  type="button"
                  // One tap reserves this slot in UI and unlocks the payment panel.
                  onClick={() => handleSlotSelect(slot)}
                  aria-pressed={isSelected}
                  aria-label={`Slot ${slot.id}, ${statusLabelMap[slot.status]}`}
                  style={{
                    borderRadius: "16px",
                    padding: "1rem",
                    border: `1px solid ${isSelected ? "#0f6ef6" : statusHighlights[slot.status]}`,
                    backgroundColor: isSelected ? "#0f6ef6" : "#fff",
                    color: isSelected ? "#fff" : "#0a1f3d",
                    textAlign: "center",
                    boxShadow: isSelected
                      ? "0 18px 40px rgba(15, 110, 246, 0.3)"
                      : "0 10px 30px rgba(10, 31, 61, 0.08)",
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    opacity: isAvailable ? 1 : 0.65,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <strong>Slot {slot.id}</strong>
                  <span style={{ fontSize: "1.1rem" }}>£{slot.price}</span>
                  <span style={{ fontSize: "0.75rem", letterSpacing: "0.4px", textTransform: "uppercase" }}>
                    {statusLabelMap[slot.status]}
                  </span>
                  <small style={{ color: isSelected ? "#dae6ff" : "#41556a", fontSize: "0.7rem" }}>
                    {slot.reason}
                  </small>
                </button>
              );
            })
          )}
        </div>
      </section>

      {status && (
        <p
          role="status"
          aria-live="polite"
          style={{
            marginTop: "1rem",
            color: statusColor,
            fontWeight: 500,
          }}
        >
          {status}
        </p>
      )}

      {selectedSlot && (
        <div
          className="payment-form"
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            borderRadius: "18px",
            background: "#ffffff",
            boxShadow: "0 30px 60px rgba(10, 31, 61, 0.08)",
            maxWidth: "480px",
          }}
        >
          <img src={logo} alt="Square Logo" style={{ width: "120px", marginBottom: "1rem" }} />
          <h2 style={{ margin: "0 0 0.3rem" }}>Pay for Slot {selectedSlot.id}</h2>
          <p style={{ margin: 0 }}>
            Amount: <strong>£{selectedSlot.price}</strong>
          </p>

          <div id="card-container" key={selectedSlot.id} style={{ marginTop: "1rem" }}></div>

          <button
            type="button"
            id="pay-button"
            // Final checkout trigger once card fields are ready.
            onClick={handlePayment}
            disabled={cardLoading || !cardRef.current}
            style={{
              marginTop: "1rem",
              padding: "0.95rem 1.4rem",
              borderRadius: "12px",
              border: "none",
              background: "#0f6ef6",
              color: "#fff",
              fontWeight: 600,
              width: "100%",
              cursor: cardLoading || !cardRef.current ? "not-allowed" : "pointer",
              opacity: cardLoading || !cardRef.current ? 0.6 : 1,
            }}
          >
            {cardLoading ? "Loading payment fields..." : "Pay now"}
          </button>
        </div>
      )}
    </main>
  );
}
