import React, { useEffect, useState } from "react";
import ParkingSlotGrid from "./ParkingSlotGrid";
import useSocket from "../hooks/useSocket";

export default function CarParkMap() {
  const [slots, setSlots] = useState([]);
  const socket = useSocket("/api/slots");

  useEffect(() => {
    fetch("/api/slots")
      .then(res => res.json())
      .then(data => setSlots(data));

    socket.on("slotUpdate", updatedSlot => {
      setSlots(prev =>
        prev.map(slot => (slot.id === updatedSlot.id ? updatedSlot : slot))
      );
    });

    return () => socket.disconnect();
  }, [socket]);

  const handleSelect = slot => {
    alert(`Selected slot ${slot.id} — status: ${slot.status}`);
    // TODO: trigger CheckoutForm.jsx
  };

  return (
    <div>
      <h2>Car Park Map</h2>
      <ParkingSlotGrid slots={slots} onSelect={handleSelect} />
    </div>
  );
}