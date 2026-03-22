import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AccessibilityProvider } from "./context/AccessibilityContext";

// App providers are centralized here so every route gets shared accessibility state.
// I keep bootstrap logic in one file so render order and providers stay easy to audit.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AccessibilityProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AccessibilityProvider>
  </StrictMode>
);