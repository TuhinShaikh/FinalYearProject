import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import CarParkMap from './components/CarParkMap';
import PaymentFosrm from './components/PaymentForm';

function App() {

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

