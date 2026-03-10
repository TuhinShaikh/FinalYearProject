import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";

// Pages
import BookingAndPaymentPage from "./pages/BookingAndPaymentPage";
import TransportPage from "./pages/transport/Transport";
import RideOptionsPage from "./pages/RideOptionsPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import TravelPlanner from "./pages/TravelPlanner";
import StatusPage from "./pages/StatusPage";
import LoginPage from "./pages/LoginPage";
import RegisterUser from "./pages/RegisterUser";
import ChatbotPage from "./pages/ChatbotPage";

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="app">

      {/* Landing options for login/register/guest */}
      {isLoginPage ? (
        <div className="hero">
          <div className="hero-overlay">
            <h1>Welcome</h1>
            <div className="auth-buttons">
              <Link to="/login"><button className="login">Login</button></Link>
              <Link to="/register"><button className="register">Register</button></Link>
              <Link to="/home"><button className="guest">Continue as Guest</button></Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Primary navigation exposed once authenticated */}
          <nav className="navbar">
            <Link to="/home"><button>Home</button></Link>
            <Link to="/transport"><button>Transport</button></Link>
            <Link to="/rides"><button>Taxi</button></Link>
            <Link to="/booking"><button>Book Parking</button></Link>
            <Link to="/status"><button>TfL</button></Link>
            <Link to="/accessibility"><button>Accessibility</button></Link>
            <Link to="/assistant"><button>Copilot</button></Link>
          </nav>

          {/* Application routes */}
          <Routes>

                  {/* Primary dashboard shortcuts grouped by category */}
            <Route
              path="/home"
              element={
                <div className="content home-hero">
                  <div className="home-logo-shell">
                    
                    <img
                      className="spurs-logo"
                      src="https://upload.wikimedia.org/wikipedia/sco/thumb/b/b4/Tottenham_Hotspur.svg/500px-Tottenham_Hotspur.svg.png?_=20170428001911"
                      alt="Tottenham Hotspur Logo"
                    />

                    <p className="home-logo-copy">
                      Tottenham Hotspur Travel Assistant
                    </p>

                    <p className="home-logo-copy">
                      Plan your journey, book parking, check TfL status and more.
                    </p>

                  </div>
                </div>
              }
            />

              {/* Individual page components */}
            <Route path="/booking" element={<BookingAndPaymentPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/rides" element={<RideOptionsPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterUser />} />

              {/* Optional travel-planner feature */}
            <Route path="/travel" element={<TravelPlanner />} />

            {/* Real TfL status dashboard */}
            <Route path="/status" element={<StatusPage />} />
            <Route path="/assistant" element={<ChatbotPage />} />

          </Routes>
        </>
      )}

    </div>
  );
}