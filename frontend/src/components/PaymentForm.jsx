import React, { useState } from "react";

export default function PaymentForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("✅ Payment successful (demo)");
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Payment</h2>
      <input type="text" placeholder="Card Number" />
      <input type="text" placeholder="Expiry Date" />
      <input type="text" placeholder="CVV" />
      <button type="submit">Pay</button>
      <p>{status}</p>
    </form>
  );
}