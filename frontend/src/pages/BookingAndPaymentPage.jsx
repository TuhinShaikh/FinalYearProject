import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import logo from "../assets/image.jpg";
import stadium from "../assets/stadium.jpg"; // add your stadium image here
        {/* Top road corner (empty) */}
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

function SlotCard({ slot, selectedSlot, setSelectedSlot }) {
  const selected = selectedSlot?.id === slot.id;

  return (
    <div
      onClick={() => setSelectedSlot(slot)}
      style={{
        padding: "10px",
        backgroundColor: selected ? "#8bc8ff" : "#ffffff",
        borderRadius: "6px",
        cursor: "pointer",
        textAlign: "center",
        border: selected ? "2px solid #3b9bff" : "1px solid #cfdaf0",
        boxShadow: selected
          ? "0 0 15px rgba(59, 139, 255, 0.35)"
          : "0 0 6px rgba(10, 31, 61, 0.05)",
        fontSize: "12px",
        userSelect: "none",
      }}
    >
      <strong>Slot {slot.id}</strong>
      <br />£{slot.price}
    </div>
  );
}

export default function BookingAndPaymentPage() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [status, setStatus] = useState("");
  const [cardLoading, setCardLoading] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    const generated = Array.from({ length: 100 }, (_, i) => {
      const id = i + 1;
      let price = 0;

      if (id === 1) price = 100;
      else if (id <= 20) price = 50;
      else if (id <= 60) price = 40;
      else if (id <= 80) price = 20;
      else price = 15;

      return { id, price };
    });

    setSlots(generated);
  }, []);

  useEffect(() => {
    const teardown = () => {
      try {
        if (cardRef.current?.destroy) cardRef.current.destroy();
      } catch {}
      cardRef.current = null;
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
          card.destroy?.();
          return;
        }

        await card.attach("#card-container");
        if (cancelled) {
          card.destroy?.();
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

    return () => {
      cancelled = true;
      teardown();
    };
  }, [selectedSlot?.id]);

  async function handlePayment(e) {
    e.preventDefault();

    if (!selectedSlot) {
      setStatus("❌ Please select a parking slot first.");
      return;
    }

    if (!cardRef.current) {
      setStatus("❌ Square card input is still loading.");
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

  // Layout mapping: slots around stadium, leaving corners empty (roads)
  const topSlots = slots.slice(0, 20);
  const leftSlots = slots.slice(20, 40);
  const rightSlots = slots.slice(40, 60);
  const bottomSlots = slots.slice(60, 80);

  return (
      <div
        style={
          display: "grid",
          gridTemplateColumns: "100px 1fr 100px",
          gridTemplateRows: "120px 320px 120px",
          gap: "20px",
          marginTop: "2rem",
          alignItems: "center",
          justifyItems: "center",
        }
      >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr 100px",
          gridTemplateRows: "100px 400px 100px",
          gap: "20px",
          marginTop: "2rem",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {/* Top road corner (empty) */}
        <div />

        {/* Top slotss */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: "10px",
            width: "100%",
          }}
        >
          {topSlots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          ))}
        </div>

        {/* Top right road corner */}
        <div />

        {/* Left slots */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: "repeat(10, 1fr)",
            gap: "10px",
            height: "100%",
          }}
        >
          {leftSlots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          ))}
        </div>

        {/* Stadium (CENTER RECTANGLE) */}
        <div
          style={
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            border: "4px solid #3b9bff",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }
        >
          <img
            src={stadium}
            alt="Stadium"
            style={{ width: "100%", height: "100%", objectFit: "cover", maxHeight: "320px" }}
          />
        </div>

        {/* Right slots */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: "repeat(10, 1fr)",
            gap: "10px",
            height: "100%",
          }}
        >
          {rightSlots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          ))}
        </div>

        {/* Bottom left road corner */}
        <div />

        {/* Bottom slots */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: "10px",
            width: "100%",
          }}
        >
          {bottomSlots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          ))}
        </div>

        {/* Bottom right road corner */}
        <div />
      </div>

      {/* Payment Section */}
      {selectedSlot && (
        <div style={{ marginTop: "3rem" }}>
          <img src={logo} alt="Square Logo" style={{ width: "120px" }} />

          <h2>Pay for Slot {selectedSlot.id}</h2>
          <p>
            Amount: <strong>£{selectedSlot.price}</strong>
          </p>

          <div id="card-container"></div>

          <button
            onClick={handlePayment}
            disabled={cardLoading || !cardRef.current}
            style={{
              padding: "12px 20px",
              background: "#c2e0ff",
              border: "1px solid #3b9bff",
              borderRadius: "6px",
              width: "100%",
              marginTop: "1rem",
              cursor:
                cardLoading || !cardRef.current ? "not-allowed" : "pointer",
              opacity: cardLoading || !cardRef.current ? 0.6 : 1,
            }}
          >
            {cardLoading ? "Loading payment..." : "Pay Now"}
          </button>

          <p style={{ marginTop: "1rem" }}>{status}</p>
        </div>
      )}
    </main>
  );
}
