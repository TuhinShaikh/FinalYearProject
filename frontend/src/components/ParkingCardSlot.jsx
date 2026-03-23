import React from "react";

// I use this card to show quick per-slot status with a simple click target.

export default function ParkingCardSlot({ slot, onSelect }) {
  const { id, status } = slot;

  const getColor = () => {
    // I map backend status values to quick visual colors so users can scan availability instantly.
    switch (status) {
      case "AVAILABLE": return "green";
      case "OCCUPIED": return "red";
      case "RESERVED": return "yellow";
      default: return "gray";
    }
  };

  return (
    <div
      className="slot-card"
      style={{
        backgroundColor: getColor(),
        padding: "10px",
        margin: "5px",
        borderRadius: "6px",
        cursor: "pointer",
        color: "white",
        textAlign: "center"
      }}
      // Whole card is clickable so mobile users don't have to target tiny text elements.
      onClick={() => onSelect(slot)}
    >
      <h4>Slot {id}</h4>
      <p>{status}</p>
    </div>
  );
}