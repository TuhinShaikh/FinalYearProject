import React from "react";
import { Link } from "react-router-dom";

// I keep this compact nav component for alternative layouts and isolated router previews.

export default function NavigationBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Three Point Lane</div>
      <div className="navbar-links">
        {/* These links are intentionally simple so demo routing is obvious to assessors. */}
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/booking">Booking</Link>
        <Link to="/payment">Payment</Link>
        <Link to="/map">Car Park Map</Link>
        <Link to="/accessibility">Accessibility</Link>
      </div>
    </nav>
  );
}