import React from 'react';
import { Link } from 'react-router-dom';

function NavigationBar() {
function NavigationBar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Car Park Map</Link></li>
        <li><Link to="/payments">Payments</Link></li>
      </ul>
    </nav>
  );
}
