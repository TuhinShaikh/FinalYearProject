import React, { useMemo } from "react";

// I use this component to visualize level-by-level parking layout and slot selection around the stadium.

const areaLabels = {
  top: "North Plaza",
  right: "East Stands",
  bottom: "South Lawn",
  left: "West Rise",
};

const slotLayout = {
  top: [1, 2, 3, 13, 14, 15],
  right: [4, 5, 6, 16, 17, 18],
  bottom: [7, 8, 9, 19, 20, 21],
  left: [10, 11, 12, 22, 23, 24],
};

const levelColors = {
  1: "#c9484b",
  2: "#f59e2e",
  3: "#0f766e",
};

const slotStyle = (isSelected) => ({
  minWidth: "90px",
  padding: "0.6rem 0.4rem",
  borderRadius: "12px",
  border: isSelected ? "2px solid #0f172a" : "1px solid rgba(15,23,42,0.24)",
  background: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
});

export default function CarParkMap({
  selectedSlot,
  onSelect,
  activeLevel,
  levels,
  onLevelChange,
  getSlotPrice,
}) {
  const levelDetail = useMemo(
    () => levels.find((level) => level.id === activeLevel) ?? levels[0],
    [activeLevel, levels]
  );

  const renderArea = (areaKey) => {
    // I render each side of the stadium with one helper so slot behavior stays identical across areas.
    return (
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        {slotLayout[areaKey].map((slotNumber) => {
          const price = getSlotPrice(slotNumber, levelDetail.id);
          const isSelected =
            selectedSlot?.level === levelDetail.id && selectedSlot?.number === slotNumber;
          return (
            <button
              key={`${areaKey}-${slotNumber}`}
              // Selecting a slot passes both number and computed price back to parent booking state.
              onClick={() => onSelect(slotNumber, price)}
              style={{
                ...slotStyle(isSelected),
                borderColor: isSelected ? levelColors[activeLevel] : "rgba(15,23,42,0.2)",
                transform: isSelected ? "translateY(-4px)" : undefined,
              }}
            >
              <span style={{ fontSize: "0.9rem", display: "block" }}>Slot {slotNumber}</span>
              <span style={{ fontSize: "0.8rem", color: "rgba(15,23,42,0.65)" }}>£{price}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        marginTop: "1.5rem",
        padding: "1.5rem",
        borderRadius: "2rem",
        background: "linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)",
        border: "1px solid rgba(15, 23, 42, 0.12)",
        boxShadow: "0 30px 60px rgba(15, 23, 42, 0.12)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Stadium Parking Levels</h3>
          <p style={{ margin: "0.3rem 0 0", maxWidth: "40ch", color: "rgba(15,23,42,0.7)" }}>
            Each level offers the same slot numbering, but switching tiers lets you park closer for a premium and climb up for better value.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {levels.map((level) => (
            <button
              key={level.id}
              // Level buttons let users compare convenience vs cost quickly.
              onClick={() => onLevelChange(level.id)}
              style={{
                padding: "0.5rem 1.3rem",
                borderRadius: "999px",
                border: level.id === activeLevel ? "none" : "1px solid rgba(15,23,42,0.25)",
                fontWeight: 600,
                background: level.id === activeLevel ? levelColors[level.id] : "rgba(15,23,42,0.08)",
                color: level.id === activeLevel ? "#fff" : "#0f172a",
                cursor: "pointer",
              }}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateAreas: "'top top top' 'left stadium right' 'bottom bottom bottom'",
          gridTemplateColumns: "1fr 1.8fr 1fr",
          gridTemplateRows: "100px 1fr 100px",
          gap: "1rem",
        }}
      >
        <div style={{ gridArea: "top" }}>
          <h4 style={{ margin: "0 0 0.4rem" }}>{areaLabels.top}</h4>
          {renderArea("top")}
        </div>
        <div
          style={{
            gridArea: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h4 style={{ margin: "0 0 0.4rem" }}>{areaLabels.left}</h4>
          {renderArea("left")}
        </div>
        <div
          style={{
            gridArea: "stadium",
            borderRadius: "28px",
            background: "linear-gradient(180deg, #0a2d6f 0%, #0f172a 100%)",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.4)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "1.25rem",
            color: "#f8fafc",
            textAlign: "center",
          }}
        >
          <p style={{ letterSpacing: "0.4rem", margin: 0 }}>🏟️</p>
          <h4 style={{ margin: "0.4rem 0 0" }}>Tottenham Hotspur Stadium</h4>
          <p style={{ margin: "0.2rem 0 0", opacity: 0.75 }}>Level {levelDetail.id} • {levelDetail.label}</p>
          <p style={{ margin: "0.1rem 0 0", fontWeight: 600 }}>£{levelDetail.price} flat rate</p>
        </div>
        <div
          style={{
            gridArea: "right",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h4 style={{ margin: "0 0 0.4rem" }}>{areaLabels.right}</h4>
          {renderArea("right")}
        </div>
        <div style={{ gridArea: "bottom" }}>
          <h4 style={{ margin: "0 0 0.4rem" }}>{areaLabels.bottom}</h4>
          {renderArea("bottom")}
        </div>
      </div>

      <div
        style={{
          marginTop: "1.4rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ margin: "0 0 0.2rem" }}>Active level focus</p>
          <p style={{ margin: 0, fontWeight: 600, color: levelColors[activeLevel] }}>
            {levelDetail.description}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 0.1rem" }}>Selected slot</p>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {selectedSlot ? `${selectedSlot.label} (Level ${selectedSlot.level})` : "None"}
          </p>
          {selectedSlot && (
            <p style={{ margin: "0", color: "rgba(15,23,42,0.7)" }}>£{selectedSlot.price}</p>
          )}
        </div>
      </div>
    </div>
  );
}
