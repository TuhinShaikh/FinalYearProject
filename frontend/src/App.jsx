import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import LoginPage from "./pages/LoginPage";
import RegisterUser from "./pages/RegisterUser";
import CheckoutForm from "./components/CheckoutForm";
import CarParkMap from "./components/CarParkMap";
import PaymentForm from "./components/PaymentForm";

function App() {
  return (
    <Router>
      <NavigationBar />
      <div style={{ marginTop: "80px", padding: "20px" }}>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterUser />} />

          {/* Core features */}
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/map" element={<CarParkMap />} />
          <Route path="/payment" element={<PaymentForm />} />

          {/* Placeholder routes */}
          <Route path="/booking" element={<div>Booking page coming soon</div>} />
          <Route path="/accessibility" element={<div>Accessibility info coming soon</div>} />

          {/* Fallback for unknown paths */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;