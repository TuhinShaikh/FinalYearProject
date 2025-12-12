import React, { useState } from "react";

export default function AccessibilityPage() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [stepFree, setStepFree] = useState(false);

  const textColor = highContrast ? "#f8fbff" : "#0a1f3d";
  const cardBackground = highContrast ? "#163362" : "#ffffff";
  const toggleBackground = highContrast ? "#f9d74a" : "#c2e0ff";
  return (
    <main
      role="main"
      aria-label="Accessibility Options"
      style={{
        padding: "2rem",
        color: textColor,
        maxWidth: "700px",
        margin: "auto",
        lineHeight: "1.6",
        fontSize: `${fontSize}px`,
        backgroundColor: highContrast ? "#0a1f3d" : "#f4f8ff",
        borderRadius: "20px",
        boxShadow: "0 25px 50px rgba(10, 31, 61, 0.08)",
        border: "1px solid rgba(10, 31, 61, 0.1)",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Accessibility Settings</h1>
      <p style={{ marginBottom: "2rem" }}>
        Adjust your viewing and navigation preferences for a more comfortable
        experience around the stadium.
      </p>

      {/* Font Size */}
      <section
        style={{
          marginBottom: "2rem",
          backgroundColor: cardBackground,
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid rgba(10, 31, 61, 0.08)",
        }}
      >
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
      <section
        style={{
          marginBottom: "2rem",
          backgroundColor: cardBackground,
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid rgba(10, 31, 61, 0.08)",
        }}
      >
        <h2>High Contrast Mode</h2>
        <p>Improves visibility with stronger color separation.</p>
        <button
          onClick={() => setHighContrast((v) => !v)}
          style={{
            backgroundColor: toggleBackground,
            marginTop: "0.5rem",
            color: "#0a1f3d",
          }}
        >
          {highContrast ? "Disable High Contrast" : "Enable High Contrast"}
        </button>
      </section>

      {/* Screen Reader Mode */}
      <section
        style={{
          marginBottom: "2rem",
          backgroundColor: cardBackground,
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid rgba(10, 31, 61, 0.08)",
        }}
      >
        <h2>Screen Reader Mode</h2>
        <p>Enhances ARIA labels and simplifies layout for assistive tools.</p>
        <button
          onClick={() => setScreenReader((v) => !v)}
          style={{
            backgroundColor: toggleBackground,
            marginTop: "0.5rem",
            color: "#0a1f3d",
          }}
        >
          {screenReader ? "Disable Screen Reader Mode" : "Enable Screen Reader Mode"}
        </button>
      </section>

      {/* Step-Free Route Filter */}
      <section
        style={{
          marginBottom: "2rem",
          backgroundColor: cardBackground,
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid rgba(10, 31, 61, 0.08)",
        }}
      >
        <h2>Step-Free Route Filter</h2>
        <p>Show only accessible routes when planning your journey.</p>
        <button
          onClick={() => setStepFree((v) => !v)}
          style={{
            backgroundColor: toggleBackground,
            marginTop: "0.5rem",
            color: "#0a1f3d",
          }}
        >
          {stepFree ? "Disable Step-Free Filter" : "Enable Step-Free Filter"}
        </button>
      </section>

      <hr style={{ margin: "2rem 0", opacity: 0.3 }} />

      <p style={{ opacity: 0.7, color: textColor }}>
        Your accessibility preferences are applied instantly and will remain active
        while you browse the site.
      </p>
    </main>
  );
}