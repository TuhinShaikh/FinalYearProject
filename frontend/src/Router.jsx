import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

// I delegate to the main App shell so this legacy entrypoint never drifts from real routes.

export default function AppRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}