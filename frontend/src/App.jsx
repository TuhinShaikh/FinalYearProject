import React from 'react';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/booking" element={<div>Booking</div>} />
        <Route path="/payment" element={<div>Payment</div>} />
        <Route path="/map" element={<div>Map</div>} />
        <Route path="/accessibility" element={<div>Accessibility</div>} />
      </Routes>
    </Router>
  );
}

export default App;