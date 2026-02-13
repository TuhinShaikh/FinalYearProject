import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import logo from "../assets/image.jpg";

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

function SlotCard({ slot, selectedSlot, setSelectedSlot }) {
  const selected = selectedSlot?.id === slot.id;

  return (
    <div
      onClick={() => setSelectedSlot(slot)}
      style={{
        padding: "15px",
        backgroundColor: selected ? "#8bc8ff" : "#ffffff",
        borderRadius: "6px",
        cursor: "pointer",
        textAlign: "center",
        border: selected ? "2px solid #3b9bff" : "1px solid #cfdaf0",
        boxShadow: selected
          ? "0 0 20px rgba(59, 139, 255, 0.35)"
          : "0 0 10px rgba(10, 31, 61, 0.05)",
        color: "#0a1f3d",
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

  // Generate slots with tiered pricing
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

  // Square card lifecycle
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

  const leftSlots = slots.slice(0, 50);
  const rightSlots = slots.slice(50);

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

      {/* 3-column layout with big center square */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px 1fr",
          gap: "20px",
          marginTop: "2rem",
          alignItems: "start",
        }}
      >
        {/* LEFT GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
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

        {/* BIG CENTER SQUARE */}
        <div
          style={{
            position: "sticky",
            top: "120px",
            height: "340px",
            borderRadius: "12px",
            border: "2px solid #3b9bff",
            background: selectedSlot ? "#e7f4ff" : "#f5f7fb",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            textAlign: "center",
            padding: "20px",
          }}
        >
          {selectedSlot ? (
            <>
              <h2>Slot {selectedSlot.id}</h2>
              <p style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
                £{selectedSlot.price}
              </p>
              <p style={{ marginTop: "8px" }}>Selected Parking Slot</p>
            </>
          ) : (
            <p>Select a slot</p>
          )}
        </div>

        {/* RIGHT GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
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
      </div>

      {/* Payment section */}
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
              cursor:
                cardLoading || !cardRef.current ? "not-allowed" : "pointer",
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
