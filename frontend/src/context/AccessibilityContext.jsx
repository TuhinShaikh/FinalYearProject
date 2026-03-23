import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "accessibility-settings";

const defaultSettings = {
  fontSize: 16,
  highContrast: false,
  screenReader: false,
  reduceMotion: false,
  stepFree: false,
};

// I store and expose accessibility preferences globally so every page reacts consistently.
const AccessibilityContext = createContext(null);

function loadSavedSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return {
      ...defaultSettings,
      ...parsed,
      fontSize: Number(parsed?.fontSize) || defaultSettings.fontSize,
    };
  } catch {
    return defaultSettings;
  }
}

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(loadSavedSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const size = Math.max(12, Math.min(28, settings.fontSize));
    document.documentElement.style.setProperty("--app-font-size", `${size}px`);
    document.body.classList.toggle("a11y-high-contrast", settings.highContrast);
    document.body.classList.toggle("a11y-screen-reader", settings.screenReader);
    document.body.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
    document.body.setAttribute("data-step-free", settings.stepFree ? "true" : "false");
  }, [settings]);

  const value = useMemo(() => {
    return {
      ...settings,
      setFontSize: (updater) => {
        setSettings((prev) => {
          const nextSize =
            typeof updater === "function" ? updater(prev.fontSize) : updater;
          return {
            ...prev,
            fontSize: Math.max(12, Math.min(28, Number(nextSize) || prev.fontSize)),
          };
        });
      },
      toggleHighContrast: () =>
        setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast })),
      toggleScreenReader: () =>
        setSettings((prev) => ({ ...prev, screenReader: !prev.screenReader })),
      toggleReduceMotion: () =>
        setSettings((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion })),
      toggleStepFree: () =>
        setSettings((prev) => ({ ...prev, stepFree: !prev.stepFree })),
      resetAccessibility: () => setSettings(defaultSettings),
    };
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}
