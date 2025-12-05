import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";

// Import pages
import BookingPage from "./pages/BookingPage";
import JourneyPlannerPage from "./pages/JourneyPlannerPage";
import RideOptionsPage from "./pages/RideOptionsPage";
import PaymentPage from "./pages/PaymentPage";
import AccessibilityPage from "./pages/AccessibilityPage";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app">
      {isHome ? (
        <>
          {/* Hero Section only on homepage */}
          <div className="hero">
            <nav className="navbar">
              <Link to="/"><button>Home</button></Link>
              <Link to="/booking"><button>Booking</button></Link>
              <Link to="/journey"><button>Great Anglia</button></Link>
              <Link to="/rides"><button>TfL</button></Link>
              <Link to="/payment"><button>Payment</button></Link>
              <Link to="/accessibility"><button>Accessibility</button></Link>
            </nav>

            <div className="hero-overlay">
              <h1>Welcome</h1>
              <div className="auth-buttons">
                <Link to="/login"><button className="login">Login</button></Link>
                <Link to="/guest"><button className="guest">Continue as Guest</button></Link>
              </div>
            </div>
          </div>

          <div className="content">
            <section className="main-buttons">
              <h2>Parking</h2>
              <Link to="/booking"><button>Book Parking Spot</button></Link>
              <Link to="/cancel"><button>Cancel Booking</button></Link>
              <Link to="/my-bookings"><button>View My Bookings</button></Link>

              <h2>Payments</h2>
              <Link to="/payment"><button>Pay Now</button></Link>
              <Link to="/refund"><button>Refund</button></Link>

              <h2>Events</h2>
              <div className="event-list">
                <div className="event-card">
                  <p><strong>Tottenham vs Arsenal</strong> — 14 Dec 2025</p>
                  <Link to="/buy-tickets"><button>Buy Tickets</button></Link>
                </div>
                <div className="event-card">
                  <p><strong>Tottenham vs West Ham</strong> — 18 Dec 2025</p>
                  <Link to="/buy-tickets"><button>Buy Tickets</button></Link>
                </div>
                <div className="event-card">
                  <p><strong>50 Cent Concert</strong> — 22 Dec 2025</p>
                  <Link to="/buy-tickets"><button>Buy Tickets</button></Link>
                </div>
                <div className="event-card">
                  <p><strong>50 Cent Afterparty</strong> — 22 Dec 2025 (Late)</p>
                  <Link to="/buy-tickets"><button>Buy Tickets</button></Link>
                </div>
              </div>
            </section>
          </div>
        </>
      ) : (
        // Render routed pages without stadium layout
        <Routes>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/journey" element={<JourneyPlannerPage />} />
          <Route path="/rides" element={<RideOptionsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/login" element={<h2 style={{ color: "white" }}>Login Page</h2>} />
          <Route path="/guest" element={<h2 style={{ color: "white" }}>Guest Mode</h2>} />
          <Route path="/cancel" element={<h2 style={{ color: "white" }}>Cancel Booking</h2>} />
          <Route path="/my-bookings" element={<h2 style={{ color: "white" }}>My Bookings</h2>} />
          <Route path="/refund" element={<h2 style={{ color: "white" }}>Refund Page</h2>} />
          <Route path="/buy-tickets" element={<h2 style={{ color: "white" }}>Buy Tickets Page</h2>} />
        </Routes>
      )}
    </div>
  );
}

export default App;