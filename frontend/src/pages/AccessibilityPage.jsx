import React, { useState } from "react";

export default function AccessibilityPage() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [stepFree, setStepFree] = useState(false);

  return (
    <main
      role="main"
      aria-label="Accessibility Options"
      style={{
        padding: "2rem",
        color: "white",
        maxWidth: "700px",
        margin: "auto",
        lineHeight: "1.6",
        fontSize: `${fontSize}px`,
        backgroundColor: highContrast ? "#000" : "transparent",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Accessibility Settings</h1>
      <p style={{ marginBottom: "2rem" }}>
        Adjust your viewing and navigation preferences for a more comfortable
        experience around the stadium.
      </p>

      {/* Font Size */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Font Size</h2>
        <p>Increase or decrease text size across the site.</p>
        <button
          onClick={() => setFontSize((s) => Math.max(12, s - 2))}
          style={{ marginRight: "1rem" }}
        >
          A-
        </button>
        <button onClick={() => setFontSize((s) => Math.min(28, s + 2))}>
          A+
        </button>
      </section>

      {/* High Contrast Mode */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>High Contrast Mode</h2>
        <p>Improves visibility with stronger color separation.</p>
        <button
          onClick={() => setHighContrast((v) => !v)}
          style={{
            backgroundColor: highContrast ? "#00bfa5" : "#333",
            marginTop: "0.5rem",
          }}
        >
          {highContrast ? "Disable High Contrast" : "Enable High Contrast"}
        </button>
      </section>

      {/* Screen Reader Mode */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Screen Reader Mode</h2>
        <p>Enhances ARIA labels and simplifies layout for assistive tools.</p>
        <button
          onClick={() => setScreenReader((v) => !v)}
          style={{
            backgroundColor: screenReader ? "#00bfa5" : "#333",
            marginTop: "0.5rem",
          }}
        >
          {screenReader ? "Disable Screen Reader Mode" : "Enable Screen Reader Mode"}
        </button>
      </section>

      {/* Step-Free Route Filter */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Step-Free Route Filter</h2>
        <p>Show only accessible routes when planning your journey.</p>
        <button
          onClick={() => setStepFree((v) => !v)}
          style={{
            backgroundColor: stepFree ? "#00bfa5" : "#333",
            marginTop: "0.5rem",
          }}
        >
          {stepFree ? "Disable Step-Free Filter" : "Enable Step-Free Filter"}
        </button>
      </section>

      <hr style={{ margin: "2rem 0", opacity: 0.3 }} />

      <p style={{ opacity: 0.7 }}>
        Your accessibility preferences are applied instantly and will remain active
        while you browse the site.
      </p>
    </main>
  );
}