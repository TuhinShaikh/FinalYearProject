import React from "react";

export default function ParkingCardSlot({ slot, onSelect }) {
  const { id, status } = slot;

  const getColor = () => {
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
      onClick={() => onSelect(slot)}
    >
      <h4>Slot {id}</h4>
      <p>{status}</p>
    </div>
  );
}