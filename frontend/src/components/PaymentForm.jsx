import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/image.jpg"; // Make sure image.jpg is in frontend/src/assets/

export default function PaymentForm() {
  const [status, setStatus] = useState("");
  const cardRef = useRef(null); // holds Square card instance
  const initializedRef = useRef(false); // ensures one-time setup

  useEffect(() => {
    if (initializedRef.current) return; // prevent re-initialization
    initializedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
    script.async = false;
    script.onload = async () => {
      try {
        const payments = window.Square.payments("sandbox-sq0idb-I-lZ-tkY-jzemSkWMfBn-A");

        const card = await payments.card();
        await card.attach("#card-container");
        cardRef.current = card;

        const payButton = document.getElementById("pay-button");
        payButton.addEventListener("click", async (e) => {
          e.preventDefault();
          const result = await cardRef.current.tokenize();
          if (result.status === "OK") {
            const response = await fetch("/api/payments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sourceId: result.token }),
            });
            const data = await response.json();
            setStatus("✅ Payment successful: " + JSON.stringify(data));
          } else {
            setStatus("❌ Payment failed: " + result.errors[0].message);
          }
        });
      } catch (err) {
        setStatus("❌ Error initializing Square: " + err.message);
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <form className="payment-form">
      <img
        src={logo}
        alt="Square Logo"
        style={{ width: "120px", marginBottom: "1rem" }}
      />
      <h2>Payment</h2>
      <div id="card-container"></div>
      <button id="pay-button">Pay</button>
      <p>{status}</p>
    </form>
  );
}