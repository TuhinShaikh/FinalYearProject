import { useEffect, useState } from "react";

export default function PaymentForm({ amountCents = 2000 }) {
  const [card, setCard] = useState(null);
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const appId = import.meta.env.VITE_SQUARE_APP_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  useEffect(() => {
    async function initSquare() {
      try {
        if (!window.Square) {
          setError("Square Web Payments SDK failed to load");
          return;
        }

        const paymentsInstance = window.Square.payments(appId, locationId);
        setPayments(paymentsInstance);

        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach("#card-container");

        setCard(cardInstance);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error initializing Square: " + err.message);
      }
    }

    initSquare();
  }, []);

  async function handlePayment() {
    try {
      const result = await card.tokenize();
      if (result.status !== "OK") {
        setError("Card tokenization failed");
        return;
      }

      const response = await fetch("http://localhost:8080/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents,
          sourceId: result.token,
        }),
      });

      const data = await response.json();
      alert("Payment successful: " + JSON.stringify(data));
    } catch (err) {
      console.error(err);
      setError("Payment failed: " + err.message);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Pay for Slot 66</h2>
      <p>Amount: £{amountCents / 100}</p>

      {/* ✅ This MUST exist before Square initializes */}
      <div id="card-container" style={{ marginBottom: "20px" }}></div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "12px 20px",
          background: "#006aff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {loading ? "Loading..." : "Pay Now"}
      </button>
    </div>
  );
}