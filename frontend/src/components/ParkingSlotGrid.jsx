import React from "react";

export default function ParkingSlotGrid({ slots, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
      {slots.map((slot, index) => (
        <div
          key={index}
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