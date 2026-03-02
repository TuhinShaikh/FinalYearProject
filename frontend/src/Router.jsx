import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import TrainsPage from './pages/transport/TrainsPage';
import RideOptionsPage from './pages/RideOptionsPage';
import PaymentPage from './pages/PaymentPage';
import AccessibilityPage from './pages/AccessibilityPage';
import NavigationBar from './components/NavigationBar';

export default function AppRouter() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/journey" element={<TrainsPage />} />
        <Route path="/rides" element={<RideOptionsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
      </Routes>
    </Router>
  );
}