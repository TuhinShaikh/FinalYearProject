import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import logo from "../assets/image.jpg";
import CarParkMap from "../components/CarParkMap";

const levelDefinitions = [
  {
    id: 1,
    label: "Level 1 • Arena",
    price: 95,
    description: "Pitch-side, premium parking for the closest possible arrival.",
  },
  {
    id: 2,
    label: "Level 2 • Club",
    price: 68,
    description: "Balanced walk / price with easy access to trams and taxis.",
  },
  {
    id: 3,
    label: "Level 3 • Skyline",
    price: 45,
    description: "Highest tier—cheaper, more reflective, ideal for early arrivals.",
  },
];

let squareSdkPromise;

function loadSquareSdk() {
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

export default function BookingAndPaymentPage() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [status, setStatus] = useState("");
  const [cardLoading, setCardLoading] = useState(false);
  const [activeLevel, setActiveLevel] = useState(levelDefinitions[0].id);
  
  const handleLevelChange = (levelId) => {
    setActiveLevel(levelId);
    if (selectedSlot?.level !== levelId) {
      setSelectedSlot(null);
    }
  };

  const cardRef = useRef(null);

  // Generate stadium-tiered slots grouped by area so the map rings can draw them
  useEffect(() => {
    const areaOrder = ["top", "right", "bottom", "left"];
    const generated = [];
    let counter = 1;

    levelDefinitions.forEach((level) => {
      areaOrder.forEach((area) => {
        for (let index = 0; index < 3; index += 1) {
          generated.push({
            id: counter,
            label: `Slot ${counter}`,
            area,
            level: level.id,
            price: Math.max(level.price - index * 2, 20),
          });
          counter += 1;
        }
      });
    });

    setSlots(generated);
  }, []);

  // --- IMPORTANT: cleanly destroy/detach old card on every slot change ---
  useEffect(() => {
    // helper: remove any previously attached card + clear DOM container
    const teardown = () => {
      try {
        if (cardRef.current?.destroy) cardRef.current.destroy();
      } catch {
        // ignore
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

    // reset before attaching a new one
    teardown();
    setStatus("");
    setCardLoading(true);

    (async () => {
      try {
        await loadSquareSdk();
        if (cancelled || !window.Square) return;

        // NOTE: if you have a Location ID, Square usually expects:
        // window.Square.payments(appId, locationId)
        const payments = window.Square.payments(
          "sandbox-sq0idb-I-lZ-tkY-jzemSkWMfBn-A"
        );

        const card = await payments.card();

        // if we got cancelled mid-flight, destroy immediately
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
      } catch (err) {
        if (!cancelled) {
          setStatus("❌ Error initializing Square: " + (err?.message ?? err));
        }
      } finally {
        if (!cancelled) setCardLoading(false);
      }
    })();

    // cleanup on slot change/unmount (also fixes React 18 StrictMode double-invoke)
    return () => {
      cancelled = true;
      teardown();
    };
  }, [selectedSlot?.id]); // depend on id, not the whole object

  async function handlePayment(e) {
    e.preventDefault();

    if (!selectedSlot) {
      setStatus("❌ Please select a parking slot first.");
      return;
    }

    if (!cardRef.current) {
      setStatus("❌ Square card input is still loading; try again shortly.");
      return;
    }

    try {
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
      setStatus("✅ Payment successful: " + JSON.stringify(data));
    } catch (err) {
      setStatus("❌ Payment error: " + (err?.message ?? err));
    }
  }

  return (
    <main
      style={{
        padding: "2rem",
        color: "#0a1f3d",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #e7f4ff 0%, #ffffff 70%)",
      }}
    >
      <h1>Book Parking & Pay</h1>
      <p>Select a parking slot to continue.</p>

      <CarParkMap
        slots={slots}
        selectedSlot={selectedSlot}
        onSelect={setSelectedSlot}
        activeLevel={activeLevel}
        levels={levelDefinitions}
        onLevelChange={handleLevelChange}
      />

      {/* Payment section is hidden until a slot is selected */}
      {selectedSlot && (
        <div className="payment-form" style={{ marginTop: "3rem" }}>
          <img
            src={logo}
            alt="Square Logo"
            style={{ width: "120px", marginBottom: "1rem" }}
          />

          <h2>Pay for Slot {selectedSlot.id}</h2>
          <p>
            Amount: <strong>£{selectedSlot.price}</strong>
          </p>

          {/* Key ensures a fresh DOM node if you ever want it; not strictly required with teardown,
              but it helps avoid edge cases */}
          <div id="card-container" key={selectedSlot.id}></div>

          <button
            id="pay-button"
            onClick={handlePayment}
            disabled={cardLoading || !cardRef.current}
            style={{
              padding: "12px 20px",
              background: "#c2e0ff",
              color: "#0a1f3d",
              border: "1px solid #3b9bff",
              borderRadius: "6px",
              cursor: cardLoading || !cardRef.current ? "not-allowed" : "pointer",
              width: "100%",
              opacity: cardLoading || !cardRef.current ? 0.6 : 1,
            }}
          >
            {cardLoading ? "Loading payment fields..." : "Pay Now"}
          </button>

          <p
            style={{
              color: status.startsWith("❌") ? "#b00020" : "#0a1f3d",
              marginTop: "1rem",
              wordBreak: "break-word",
            }}
          >
            {status}
          </p>
        </div>
      )}
    </main>
  );
}
