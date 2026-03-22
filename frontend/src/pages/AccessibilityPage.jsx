import React from "react";
import { useAccessibility } from "../context/AccessibilityContext";

// I use this page to centralize all accessibility toggles so users can tune the full experience in one place.

export default function AccessibilityPage() {
  const {
    fontSize,
    highContrast,
    screenReader,
    reduceMotion,
    stepFree,
    setFontSize,
    toggleHighContrast,
    toggleScreenReader,
    toggleReduceMotion,
    toggleStepFree,
    resetAccessibility,
  } = useAccessibility();

  const textColor = highContrast ? "#f8fbff" : "#0a1f3d";
  // These derived colors keep controls readable when contrast mode flips.
  const cardBackground = highContrast ? "#163362" : "#ffffff";
  const toggleBackground = highContrast ? "#f9d74a" : "#c2e0ff";
  const controlButtonStyle = {
    minHeight: "44px",
    minWidth: "44px",
    padding: "0.75rem 1rem",
  };

  const statusSummary = `Font size ${fontSize}px. High contrast ${highContrast ? "on" : "off"}. Assistive reading mode ${screenReader ? "on" : "off"}. Reduced motion ${reduceMotion ? "on" : "off"}. Step-free route filter ${stepFree ? "on" : "off"}.`;

  return (
    <main
      role="main"
      id="main-content"
      tabIndex={-1}
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
      <p className="sr-only" aria-live="polite">
        {statusSummary}
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
        <p style={{ margin: "0.25rem 0 0.75rem", opacity: 0.75 }}>Current size: {fontSize}px</p>
        <button
          // I cap the lower bound so text never becomes unreadably small.
          onClick={() => setFontSize((s) => Math.max(12, s - 2))}
          aria-label="Decrease font size"
          style={{ ...controlButtonStyle, marginRight: "1rem" }}
        >
          A-
        </button>
        <button
          // I cap the upper bound to avoid layout breakage on very large font sizes.
          onClick={() => setFontSize((s) => Math.min(28, s + 2))}
          aria-label="Increase font size"
          style={controlButtonStyle}
        >
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
          onClick={toggleHighContrast}
          aria-pressed={highContrast}
          style={{
            backgroundColor: toggleBackground,
            marginTop: "0.5rem",
            color: "#0a1f3d",
            ...controlButtonStyle,
          }}
        >
          {highContrast ? "Disable High Contrast" : "Enable High Contrast"}
        </button>
      </section>

      {/* Assistive Reading Mode */}
      <section
        style={{
          marginBottom: "2rem",
          backgroundColor: cardBackground,
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid rgba(10, 31, 61, 0.08)",
        }}
      >
        <h2>Assistive Reading Mode</h2>
        <p>Increases spacing and readability to support assistive tools and easier scanning.</p>
        <button
          onClick={toggleScreenReader}
          aria-pressed={screenReader}
          style={{
            backgroundColor: toggleBackground,
            marginTop: "0.5rem",
            color: "#0a1f3d",
            ...controlButtonStyle,
          }}
        >
          {screenReader ? "Disable Assistive Reading" : "Enable Assistive Reading"}
        </button>
      </section>

      {/* Reduced Motion */}
      <section
        style={{
          marginBottom: "2rem",
          backgroundColor: cardBackground,
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid rgba(10, 31, 61, 0.08)",
        }}
      >
        <h2>Reduced Motion</h2>
        <p>Turns off transitions and animations across the site where possible.</p>
        <button
          onClick={toggleReduceMotion}
          aria-pressed={reduceMotion}
          style={{
            backgroundColor: toggleBackground,
            marginTop: "0.5rem",
            color: "#0a1f3d",
            ...controlButtonStyle,
          }}
        >
          {reduceMotion ? "Disable Reduced Motion" : "Enable Reduced Motion"}
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
          onClick={toggleStepFree}
          aria-pressed={stepFree}
          style={{
            backgroundColor: toggleBackground,
            marginTop: "0.5rem",
            color: "#0a1f3d",
            ...controlButtonStyle,
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

      <button
        // One reset button gives users a reliable way back to default settings.
        onClick={resetAccessibility}
        style={{
          marginTop: "1rem",
          backgroundColor: "#d4e9ff",
          color: "#0a1f3d",
          ...controlButtonStyle,
        }}
      >
        Reset to Defaults
      </button>
    </main>
  );
}