import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingAndPaymentPage from "./pages/BookingAndPaymentPage";
import TransportPage from "./pages/transport/Transport";
import RideOptionsPage from "./pages/RideOptionsPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import StatusPage from "./pages/StatusPage";
import NavigationBar from "./components/NavigationBar";

// I keep this lightweight router for isolated feature demos outside the main app shell.

export default function AppRouter() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        {/* This router is kept as a lightweight alternative shell for isolated testing. */}
        <Route path="/booking" element={<BookingAndPaymentPage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/rides" element={<RideOptionsPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
      </Routes>
    </Router>
  );
}