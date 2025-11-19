import React, { useState } from 'react';

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call backend /payments/charge endpoint
    console.log("Submitting payment for card:", cardNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Payment</h2>
      <input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />
      <button type="submit">Pay</button>
    </form>
  );
}

export default PaymentForm;