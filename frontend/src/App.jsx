import React from 'react';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterUser from './pages/RegisterUser';
import CheckoutForm from './components/CheckoutForm';
import CarParkMap from './components/CarParkMap';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/map" element={<CarParkMap />} />
        <Route path="/booking" element={<div>Booking</div>} />
        <Route path="/payment" element={<div>Payment</div>} />
        <Route path="/accessibility" element={<div>Accessibility</div>} />
      </Routes>
    </Router>
  );
}

export default App;