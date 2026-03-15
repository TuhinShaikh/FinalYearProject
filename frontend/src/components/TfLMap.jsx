import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const lineColors = {
  Bakerloo: "#b36305",
  Central: "#e32017",
  Circle: "#ffd300",
  District: "#00782a",
  Metropolitan: "#751056",
  Northern: "#000000",
  Piccadilly: "#0019a8",
  Victoria: "#0098d4",
  "Waterloo & City": "#95cdb3",
  WaterlooCity: "#95cdb3",
  Jubilee: "#6a7278",
  "Hammersmith & City": "#f3a9bb",
  HammersmithCity: "#f3a9bb",
  LondonOverground: "#ed6c02",
  DLR: "#00afad",
};

const premierStadiums = [
  { club: "Arsenal", stadium: "Emirates Stadium", lat: 51.5549, lon: -0.1084 },
  { club: "Aston Villa", stadium: "Villa Park", lat: 52.5090, lon: -1.8843 },
  { club: "Bournemouth", stadium: "Vitality Stadium", lat: 50.7351, lon: -1.8380 },
  { club: "Brentford", stadium: "Gtech Community Stadium", lat: 51.4888, lon: -0.2881 },
  { club: "Brighton", stadium: "Falmer Stadium", lat: 50.8615, lon: -0.0830 },
  { club: "Chelsea", stadium: "Stamford Bridge", lat: 51.4817, lon: -0.1909 },
  { club: "Crystal Palace", stadium: "Selhurst Park", lat: 51.3984, lon: -0.0852 },
  { club: "Everton", stadium: "Goodison Park", lat: 53.4388, lon: -2.9665 },
  { club: "Fulham", stadium: "Craven Cottage", lat: 51.4747, lon: -0.2215 },
  { club: "Liverpool", stadium: "Anfield", lat: 53.4308, lon: -2.9608 },
  { club: "Luton Town", stadium: "Kenilworth Road", lat: 51.8875, lon: -0.4170 },
  { club: "Manchester City", stadium: "Etihad Stadium", lat: 53.4831, lon: -2.2004 },
  { club: "Manchester United", stadium: "Old Trafford", lat: 53.4631, lon: -2.2913 },
  { club: "Newcastle United", stadium: "St James' Park", lat: 54.9756, lon: -1.6210 },
  { club: "Nottingham Forest", stadium: "City Ground", lat: 52.9350, lon: -1.1346 },
  { club: "Tottenham Hotspur", stadium: "Tottenham Hotspur Stadium", lat: 51.6048, lon: -0.0660 },
  { club: "West Ham United", stadium: "London Stadium", lat: 51.5387, lon: -0.0165 },
  { club: "Wolverhampton Wanderers", stadium: "Molineux", lat: 52.5897, lon: -2.1354 },
  { club: "Sheffield United", stadium: "Bramall Lane", lat: 53.3759, lon: -1.4705 },
  { club: "Leicester City", stadium: "King Power Stadium", lat: 52.6203, lon: -1.1420 },
];

const londonCenter = [51.5074, -0.1278];

export default function TfLMap({ tflStatus }) {
  const [stopPoints, setStopPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    axios
      .get("https://api.tfl.gov.uk/Line/Mode/tube/StopPoints")
      .then((res) => {
        if (!mounted) return;
        const payload = res.data?.stopPoints ?? res.data ?? [];
        setStopPoints(Array.isArray(payload) ? payload : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError("Unable to load tube stop data: " + (err?.message ?? "network"));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const lineStationSummary = useMemo(() => {
    const summary = {};
    stopPoints.forEach((stop) => {
      (stop.lines ?? []).forEach((line) => {
        const name = line?.name ?? line;
        if (!name) return;
        summary[name] = (summary[name] ?? 0) + 1;
      });
    });
    return summary;
  }, [stopPoints]);

  const lineSummaries = useMemo(() => {
    return tflStatus.map((line) => {
      const severity = line.lineStatuses?.[0]?.statusSeverityDescription ?? "Unknown";
      return {
        id: line.id ?? line.name,
        name: line.name,
        severity,
        stations: lineStationSummary[line.name] ?? 0,
      };
    });
  }, [lineStationSummary, tflStatus]);

  const disruptions = useMemo(() => {
    const entries = [];
    tflStatus.forEach((line) => {
      (line.lineStatuses ?? []).forEach((status) => {
        (status.disruptions ?? []).forEach((disruption) => {
          entries.push({
            id: disruption?.disruptionId ?? `${line.id}-${status.statusSeverityDescription}`,
            line: line.name,
            description:
              disruption?.description ?? disruption?.category ?? "Disruption reported",
            impact: status.statusSeverityDescription,
          });
        });
      });
    });
    return entries;
  }, [tflStatus]);

  return (
    <div
      style={{
        marginTop: "1.5rem",
        padding: "1rem",
        borderRadius: "16px",
        border: "1px solid rgba(10, 31, 61, 0.15)",
        background: "#fdfcfe",
        boxShadow: "0 25px 60px rgba(10, 31, 61, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>TfL Tube Map</h3>
          <p style={{ margin: "0.25rem 0 0" }}>
            Live London tube lines, stations, and Premier League stadiums pushed on top of an OpenStreetMap
            base tile.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{stopPoints.length} stations plotted</p>
          <p style={{ margin: 0 }}>{loading ? "Loading..." : "Data refreshed live"}</p>
        </div>
      </div>

      {loading && <p>Loading tube coordinates...</p>}
      {error && (
        <p style={{ color: "#b00020", marginBottom: "1rem" }}>
          {error}
        </p>
      )}

      <div style={{ height: "60vh", borderRadius: "14px", overflow: "hidden" }}>
        <MapContainer center={londonCenter} zoom={11} scrollWheelZoom style={{ height: "100%" }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {stopPoints.map((stop) => {
            const lat = stop.lat ?? stop.latitude;
            const lon = stop.lon ?? stop.longitude;
            if (lat == null || lon == null) return null;
            const lineName = stop.lines?.[0]?.name ?? stop.line?.name;
            const stationLines = (stop.lines ?? []).map((line) => line?.name ?? line ?? "").filter(Boolean);
            return (
              <CircleMarker
                key={stop.id ?? stop.naptanId}
                center={[lat, lon]}
                radius={3}
                pathOptions={{ color: lineColors[lineName] ?? "#1c4f7c", fillOpacity: 0.9 }}
              >
                <Popup>
                  <strong>{stop.commonName ?? stop.name ?? "Unknown stop"}</strong>
                  <br />
                  {stationLines.join(", ")}
                </Popup>
              </CircleMarker>
            );
          })}

          {premierStadiums.map((stadium) => (
            <CircleMarker
              key={stadium.club + stadium.stadium}
              center={[stadium.lat, stadium.lon]}
              radius={6}
              pathOptions={{ color: "#8b0000", fillColor: "#ff3b30", fillOpacity: 1, weight: 2 }}
            >
              <Popup>
                <strong>{stadium.club}</strong>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {lineSummaries.map((line) => (
            <div
              key={line.id}
              style={{
                padding: "0.75rem",
                borderRadius: "10px",
                background: "#f4f8ff",
                border: "1px solid rgba(10, 31, 61, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "50%",
                    background: lineColors[line.name] ?? "#666",
                  }}
                />
                <strong>{line.name}</strong>
              </div>
              <p style={{ margin: "0.35rem 0" }}>
                {line.stations ? `${line.stations} stations` : "Station data pending"}
              </p>
              <p style={{ margin: 0 }}>{line.severity}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "0.75rem",
            borderRadius: "10px",
            background: "#fff2e5",
            border: "1px solid rgba(191, 90, 0, 0.4)",
          }}
        >
          <h4 style={{ margin: "0 0 0.5rem" }}>Live disruptions</h4>
          {disruptions.length === 0 && <p style={{ margin: 0 }}>All lines normal.</p>}
          {disruptions.map((disruption) => (
            <p key={disruption.id} style={{ margin: "0.15rem 0" }}>
              <strong>{disruption.line}</strong>: {disruption.description}
              <br />
              Impact: {disruption.impact}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
