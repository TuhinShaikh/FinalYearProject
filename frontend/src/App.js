import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import CarParkMap from './components/CarParkMap';
import PaymentForm from './components/PaymentForm';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<CarParkMap />} />
        <Route path="/payments" element={<PaymentForm />} />
      </Routes>
    </Router>
  );
}

export default App;