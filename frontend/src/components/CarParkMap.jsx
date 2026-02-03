import React, { useMemo } from "react";

const areaLabels = {
  top: "North Plaza",
  right: "East Stands",
  bottom: "South Lawn",
  left: "West Rise",
};

const levelColors = {
  1: "#c9484b",
  2: "#f59e2e",
  3: "#0f766e",
};

export default function CarParkMap({
  slots,
  selectedSlot,
  onSelect,
  activeLevel,
  levels,
  onLevelChange,
}) {
  const grouped = useMemo(() => {
    return (slots ?? []).reduce((acc, slot) => {
      const list = acc[slot.area] ?? [];
      list.push(slot);
      acc[slot.area] = list;
      return acc;
    }, {});
  }, [slots]);

  const levelDetail = levels.find((level) => level.id === activeLevel) ?? levels[0];

  const renderArea = (areaKey) => {
    const areaSlots = (grouped[areaKey] ?? []).sort((a, b) => a.id - b.id);
    return (
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {areaSlots.map((slot) => {
          const isActive = slot.level === activeLevel;
          const isSelected = selectedSlot?.id === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => isActive && onSelect(slot)}
              disabled={!isActive}
              style={{
                flex: "1 1 56px",
                minWidth: "56px",
                padding: "0.45rem 0.6rem",
                borderRadius: "12px",
                border: isSelected
                  ? `2px solid ${levelColors[slot.level]}`
                  : "1px solid rgba(15, 23, 42, 0.2)",
                background: isActive
                  ? "linear-gradient(180deg, #fdf2f8 0%, #fefbff 60%)"
                  : "#f1f5f9",
                color: "#0f172a",
                fontWeight: 600,
                cursor: isActive ? "pointer" : "not-allowed",
                opacity: isActive ? 1 : 0.4,
                transition: "transform 0.15s ease",
              }}
            >
              {slot.label}
              <br />
              £{slot.price}
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
        background: "linear-gradient(180deg, #eef2ff 0%, #fefefe 100%)",
        border: "1px solid rgba(15, 23, 42, 0.1)",
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
          <p style={{ margin: "0.2rem 0 0", maxWidth: "36ch" }}>
            Select the level you want to park on. Higher levels are farther from the stadium but cheaper, while Level 1 wraps the pitch with premium spots.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => onLevelChange(level.id)}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "999px",
                border: level.id === activeLevel ? "none" : "1px solid rgba(15,23,42,0.2)",
                fontWeight: 600,
                background: level.id === activeLevel ? levelColors[level.id] : "rgba(15,23,42,0.05)",
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
          gridTemplateColumns: "1fr 1.6fr 1fr",
          gridTemplateRows: "120px 1fr 120px",
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
          <div>{renderArea("left")}</div>
        </div>
        <div
          style={{
            gridArea: "stadium",
            borderRadius: "32px",
            background: "linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.35)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "1.5rem",
            color: "#f8fafc",
            textAlign: "center",
          }}
        >
          <p style={{ letterSpacing: "0.4rem", margin: 0 }}>🏟️</p>
          <h4 style={{ margin: "0.5rem 0 0" }}>The Arcadium</h4>
          <p style={{ margin: 0, opacity: 0.7 }}>Current level: {levelDetail.label}</p>
          <p style={{ margin: "0.2rem 0 0", fontWeight: 600 }}>£{levelDetail.price} flat rate</p>
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
          <div>{renderArea("right")}</div>
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
        }}
      >
        <div>
          <p style={{ margin: "0 0 0.2rem" }}>Active level focus</p>
          <p style={{ margin: 0, fontWeight: 600, color: levelColors[activeLevel] }}>
            {levelDetail.description}
          </p>
        </div>
        <div>
          <p style={{ margin: "0 0 0.2rem" }}>Selected slot</p>
          <p style={{ margin: 0, fontWeight: 600 }}>{selectedSlot ? selectedSlot.label : "None"}</p>
          {selectedSlot && (
            <p style={{ margin: 0 }}>
              Level {selectedSlot.level} • £{selectedSlot.price}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
