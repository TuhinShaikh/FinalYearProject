import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StatusPage() {
  const [gaStatus, setGaStatus] = useState([]);
  const [tflStatus, setTflStatus] = useState([]);
  const [uberSurge, setUberSurge] = useState(null);

  useEffect(() => {
    fetchGreaterAnglia();
    fetchTfL();
    fetchUber();
  }, []);

  // ✅ Greater Anglia (your backend)
  const fetchGreaterAnglia = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/trains/greater-anglia");
      setGaStatus(res.data.trainServices || []);
    } catch (err) {
      console.error("GA error", err);
    }
  };

  // ✅ TfL Line Status
  const fetchTfL = async () => {
    try {
      const res = await axios.get("https://api.tfl.gov.uk/Line/Mode/tube/Status");
      setTflStatus(res.data);
    } catch (err) {
      console.error("TfL error", err);
    }
  };

  // ✅ Uber surge (mocked)
  const fetchUber = () => {
    setUberSurge((Math.random() * 2 + 1).toFixed(2)); // 1.0x – 3.0x
  };

  return (
    <main style={{ padding: "2rem", color: "white" }}>
      <h1>Live Status Dashboard</h1>

      {/* ✅ Greater Anglia */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Greater Anglia Status</h2>
        {gaStatus.length === 0 && <p>No live data.</p>}
        {gaStatus.map((t, i) => (
          <div key={i} style={{ background: "#222", padding: "1rem", marginBottom: "1rem" }}>
            <strong>{t.destination[0].locationName}</strong>
            <p>Scheduled: {t.std}</p>
            <p>Expected: {t.etd}</p>
          </div>
        ))}
      </section>

      {/* ✅ TfL */}
      <section style={{ marginTop: "2rem" }}>
        <h2>TfL Tube Status</h2>
        {tflStatus.map((line, i) => (
          <div key={i} style={{ background: "#222", padding: "1rem", marginBottom: "1rem" }}>
            <strong>{line.name}</strong>
            <p>{line.lineStatuses[0].statusSeverityDescription}</p>
          </div>
        ))}
      </section>

      {/* ✅ Uber */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Uber Surge Pricing</h2>
        <p>Current surge: <strong>{uberSurge}x</strong></p>
      </section>
    </main>
  );
}