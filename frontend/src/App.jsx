import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";

// Pages
import BookingAndPaymentPage from "./pages/BookingAndPaymentPage";
import JourneyPlannerPage from "./pages/JourneyPlannerPage";
import RideOptionsPage from "./pages/RideOptionsPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import TravelPlanner from "./pages/TravelPlanner"; // optional if you use it

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="app">

      {/* ✅ FIRST PAGE: LOGIN OR GUEST */}
      {isLoginPage ? (
        <div className="hero">
          <div className="hero-overlay">
            <h1>Welcome</h1>
            <div className="auth-buttons">
              <Link to="/home"><button className="login">Login</button></Link>
              <Link to="/home"><button className="guest">Continue as Guest</button></Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ✅ NAVBAR AFTER LOGIN */}
          <nav className="navbar">
            <Link to="/home"><button>Home</button></Link>
            <Link to="/journey"><button>Greater Anglia</button></Link>
            <Link to="/rides"><button>TfL</button></Link>
            <Link to="/booking"><button>Book Parking</button></Link>
            <Link to="/status"><button>Live Status</button></Link>
            <Link to="/accessibility"><button>Accessibility</button></Link>
          </nav>

          {/* ✅ ROUTES */}
          <Routes>
            {/* ✅ MAIN DASHBOARD */}
            <Route
              path="/home"
              element={
                <div className="content">
                  <section className="main-buttons">
                    <h2>Transport</h2>
                    <Link to="/journey"><button>Greater Anglia</button></Link>
                    <Link to="/rides"><button>TfL</button></Link>

                    <h2>Parking</h2>
                    <Link to="/booking"><button>Book Parking</button></Link>

                    <h2>Live Updates</h2>
                    <Link to="/status"><button>Live Status</button></Link>
                  </section>
                </div>
              }
            />

            {/* ✅ INDIVIDUAL PAGES */}
            <Route path="/booking" element={<BookingAndPaymentPage />} />
            <Route path="/journey" element={<JourneyPlannerPage />} />
            <Route path="/rides" element={<RideOptionsPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />

            {/* ✅ OPTIONAL: TravelPlanner if you want it */}
            <Route path="/travel" element={<TravelPlanner />} />

            {/* ✅ Placeholder Live Status */}
            <Route
              path="/status"
              element={<h2 style={{ color: "white", padding: "2rem" }}>Live Status Coming Soon</h2>}
            />
          </Routes>
        </>
      )}
    </div>
  );
}