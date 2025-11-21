import React, { useState } from "react";
import ParkingSlotGrid from "./ParkingSlotGrid";

export default function CarParkMap() {
  const [slots, setSlots] = useState(
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1, selected: false }))
  );

  const handleSelect = (selectedSlot) => {
    setSlots(slots.map(slot =>
      slot.id === selectedSlot.id ? { ...slot, selected: !slot.selected } : slot
    ));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Car Park Map</h2>
      <ParkingSlotGrid slots={slots} onSelect={handleSelect} />
    </div>
  );
}