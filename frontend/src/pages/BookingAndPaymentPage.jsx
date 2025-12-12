import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import logo from "../assets/image.jpg";

export default function BookingAndPaymentPage() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [status, setStatus] = useState("");

  const cardRef = useRef(null);

  // ✅ Generate slots
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

  // ✅ Initialize Square ONLY after selectedSlot is set AND DOM is rendered
  useEffect(() => {
    if (!selectedSlot) return;

    async function initSquare() {
      try {
        // Load script if not already loaded
        if (!window.Square) {
          const script = document.createElement("script");
          script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
          script.onload = initSquare;
          document.body.appendChild(script);
          return;
        }

        const payments = window.Square.payments(
          "sandbox-sq0idb-I-lZ-tkY-jzemSkWMfBn-A"
        );

        const card = await payments.card();
        await card.attach("#card-container"); // ✅ Now DOM exists
        cardRef.current = card;

      } catch (err) {
        setStatus("❌ Error initializing Square: " + err.message);
      }
    }

    initSquare();
  }, [selectedSlot]);

  async function handlePayment(e) {
    e.preventDefault();

    if (!selectedSlot) {
      setStatus("❌ Please select a parking slot first.");
      return;
    }

    try {
      const result = await cardRef.current.tokenize();

      if (result.status !== "OK") {
        setStatus("❌ Payment failed: " + result.errors[0].message);
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
      setStatus("❌ Payment error: " + err.message);
    }
  }

  return (
    <main style={{ padding: "2rem", color: "white" }}>
      <h1>Book Parking & Pay</h1>
      <p>Select a parking slot to continue.</p>

      {/* ✅ Parking Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: "10px",
          marginTop: "2rem",
        }}
      >
        {slots.map((slot) => (
          <div
            key={slot.id}
            onClick={() => setSelectedSlot(slot)}
            style={{
              padding: "15px",
              backgroundColor:
                selectedSlot?.id === slot.id ? "#00bfa5" : "#333",
              borderRadius: "6px",
              cursor: "pointer",
              textAlign: "center",
              border: "1px solid #555",
            }}
          >
            <strong>Slot {slot.id}</strong>
            <br />
            £{slot.price}
          </div>
        ))}
      </div>

      {/* ✅ Payment Section */}
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

          {/* ✅ This now ALWAYS exists before Square attaches */}
          <div id="card-container"></div>

          <button id="pay-button" onClick={handlePayment}>
            Pay Now
          </button>

          <p>{status}</p>
        </div>
      )}
    </main>
  );
}