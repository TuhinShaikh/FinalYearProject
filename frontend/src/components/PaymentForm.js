import React, { useState } from 'react';

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call backend /payments/charge endpoint
    console.log("Submitting payment for card:", cardNumber);
  };

