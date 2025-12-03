import React, { useState } from "react";
import axios from "axios";

const TravelPlanner: React.FC = () => {
  const [options, setOptions] = useState<any[]>([]);

  const fetchRecommendations = async () => {
    const response = await axios.post("/travel/recommend", null, {
      params: {
        origin: "Stratford",
        destination: "Liverpool Street",
        accessibilityNeeded: true,
        badWeather: false,
      },
    });
    setOptions(response.data);
  };

  return (
    <div>
      <h2>Travel Planner</h2>
      <button onClick={fetchRecommendations}>Get Recommendations</button>
      <div>
        {options.map((opt, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", margin: "8px", padding: "8px" }}>
            <strong>{opt.mode}</strong> via {opt.provider} — {opt.estimatedTime} mins (£{opt.cost})  
            {opt.recommended && <span style={{ color: "green" }}> ★ Recommended</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelPlanner;