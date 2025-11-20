import React, { useState } from 'react';
import api from '../utils/api';
import './PaymentForm.css';

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { cardNumber, expiry, cvv };
      const response = await api.post('/payment', payload);
      console.log('Payment successful:', response.data);
    } catch (err) {
      console.error('Payment failed:', err.response?.data || err.message);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Payment Details</h2>
      <input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Expiry (MM/YY)"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
        required
      />
      <button type="submit">Pay Now</button>
    </form>
  );
}

export default PaymentForm;