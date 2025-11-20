import React from "react";
import ParkingCardSlot from "./ParkingCardSlot";

export default function ParkingSlotGrid({ slots, onSelect }) {
  return (
    <div
      className="slot-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "10px",
        padding: "20px"
      }}
    >
      {slots.map(slot => (
        <ParkingCardSlot key={slot.id} slot={slot} onSelect={onSelect} />
      ))}
    </div>
  );
}