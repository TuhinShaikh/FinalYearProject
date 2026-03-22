// src/hooks/useSocket.jsx
import { useEffect } from "react";

// I keep this hook as the socket integration point so real-time wiring can be added without touching pages.

export default function useSocket() {
  useEffect(() => {
    console.log("Socket hook initialized");
  }, []);
  return {};
}