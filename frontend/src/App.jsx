import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* Hero Section */}
      <div className="hero">
        {/* Top Navbar */}
        <nav className="navbar">
          <button>Home</button>
          <button>Dashboard</button>
          <button>Profile</button>
          <button>Great Anglia</button>
          <button>TfL</button>
        </nav>

        {/* Centered Welcome */}
        <div className="hero-overlay">
          <h1>Hi</h1>
          <div className="auth-buttons">
            <button className="login">Login</button>
            <button className="guest">Continue as Guest</button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="content">
        <section className="main-buttons">
          <h2>Parking</h2>
          <button>Book Parking Spot</button>
          <button>Cancel Booking</button>
          <button>View My Bookings</button>

          <h2>Payments</h2>
          <button>Pay Now</button>
          <button>Refund</button>
        </section>
      </div>
    </div>
  );
}

export default App;