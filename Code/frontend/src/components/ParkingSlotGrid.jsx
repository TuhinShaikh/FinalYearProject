import React from "react";

// I keep this grid as a reusable simple slot picker for lightweight pages/tests.

export default function ParkingSlotGrid({ slots, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
      {slots.map((slot, index) => (
        <div
          key={index}
          // Clicking a tile reports the full slot object to parent selection state.
          onClick={() => onSelect(slot)}
          style={{
            padding: "20px",
            backgroundColor: slot.selected ? "#4caf50" : "#ccc",
            textAlign: "center",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Slot {slot.id}
        </div>
      ))}
    </div>
  );
}