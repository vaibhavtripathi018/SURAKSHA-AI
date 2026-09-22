import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Predictions = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: "Gangtok",
    rainfall: 0,
    slope: 30,
    soil_moisture: 0,
    elevation: 498,
  });

  const [weather, setWeather] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const savedPrediction = localStorage.getItem("surakshaPrediction");

    if (savedPrediction) {
      try {
        setPrediction(JSON.parse(savedPrediction));
      } catch (error) {
        console.error("Saved prediction error:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "location" ? value : Number(value),
    }));
  };

  const getWeather = async () => {
  try {
    setWeatherLoading(true);

    const weatherResponse = await fetch(
      `https://suraksha-ai-3e2g.onrender.com/weather?location=${encodeURIComponent(
        formData.location
      )}`
    );

    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      throw new Error(weatherData.detail || "Weather fetch failed");
    }

    const terrainResponse = await fetch(
      `https://suraksha-ai-3e2g.onrender.com/terrain?latitude=${weatherData.latitude}&longitude=${weatherData.longitude}`
    );

    const terrainData = await terrainResponse.json();

    if (!terrainResponse.ok) {
      throw new Error(terrainData.detail || "Terrain fetch failed");
    }

    const updatedWeather = {
      ...weatherData,
      elevation: terrainData.elevation,
    };

    setWeather(updatedWeather);

    setFormData((prev) => ({
      ...prev,
      rainfall: weatherData.rainfall ?? 0,
      soil_moisture: (weatherData.soil_moisture ?? 0) * 100,
      elevation: terrainData.elevation ?? 0,
      slope: terrainData.slope ?? 0,
    }));

    return {
      ...weatherData,
      elevation: terrainData.elevation,
    };

    }   catch (error) {
      console.error("Weather/Terrain Error:", error);
      alert(error.message);
      return null;
    }   finally {
      setWeatherLoading(false);
    }
  };
  const handlePredict = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Get live weather first
      const liveWeather = await getWeather();

      if (!liveWeather) {
        setLoading(false);
        return;
      }

      const rainfall = Number(
        liveWeather.rainfall ?? liveWeather.precipitation ?? 0
      );

      const soilMoisture = Number(liveWeather.soilMoisture ?? 0);

      // Send live weather + terrain data to prediction API
      const response = await fetch("https://suraksha-ai-3e2g.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: formData.location,
          rainfall: rainfall,
          slope: Number(formData.slope),
          soilMoisture: soilMoisture,
          elevation: Number(formData.elevation),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Prediction API Error:", errorText);
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      setPrediction(data);

      const predictionWithLocation = {
      ...data,
        latitude: liveWeather.latitude,
        longitude: liveWeather.longitude,
        weatherLocation: liveWeather.location,
      };

        setPrediction(predictionWithLocation);

        localStorage.setItem(
        "surakshaPrediction",
        JSON.stringify(predictionWithLocation)
      );
    } catch (error) {
      console.error("Prediction Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskScore = () => {
    if (!prediction) return 0;

    return (
      prediction.risk_score ??
      prediction.risk_percentage ??
      prediction.probability ??
      prediction.score ??
      0
    );
  };

  const getRiskLevel = () => {
    if (!prediction) return "No Prediction";

    if (prediction.risk_level) return prediction.risk_level;
    if (prediction.risk) return prediction.risk;
    if (prediction.level) return prediction.level;

    const score = Number(getRiskScore());

    if (score >= 70) return "High Risk";
    if (score >= 40) return "Moderate Risk";

    return "Low Risk";
  };

  const riskScore = getRiskScore();
  const riskLevel = getRiskLevel();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>AI Risk Prediction</h1>
          <p>
            Generate landslide risk predictions using live environmental
            conditions.
          </p>
        </div>
      </div>

      <div className="prediction-container">
        {/* Prediction Form */}
        <div className="prediction-form-card">
          <div className="card-header">
            <div className="robot-icon">🤖</div>

            <div>
              <h2>Prediction Input</h2>
              <p>Enter location and terrain information</p>
            </div>
          </div>

          <form onSubmit={handlePredict}>
            {/* Location */}
            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location e.g. Gangtok"
                required
              />
            </div>

            {/* Live Weather */}
            <div className="weather-section">
              <div className="weather-section-header">
                <div>
                  <h3>🌦️ Live Weather</h3>
                  <p>Automatically fetched from weather service</p>
                </div>

                <button
                  type="button"
                  className="weather-button"
                  onClick={getWeather}
                  disabled={weatherLoading}
                >
                  {weatherLoading ? "Loading..." : "Get Weather"}
                </button>
              </div>

              {weather && (
                <div className="weather-grid">
                  <div className="weather-box">
                    <span>🌧️ Rainfall</span>
                    <strong>{weather.rainfall ?? 0} mm</strong>
                  </div>

                  <div className="weather-box">
                    <span>💧 Soil Moisture</span>
                    <strong>
                      {(
                        Number(weather.soil_moisture ?? 0) * 100
                      ).toFixed(2)}
                      %
                    </strong>
                  </div>

                  <div className="weather-box">
                    <span>🌡️ Temperature</span>
                    <strong>
                      {weather.temperature ?? 0} °C
                    </strong>
                  </div>

                  <div className="weather-box">
                    <span>💨 Wind Speed</span>
                    <strong>
                      {weather.wind_speed ?? 0} km/h
                    </strong>
                  </div>

                  <div className="weather-box">
                    <span>💦 Humidity</span>
                    <strong>
                      {weather.humidity ?? 0}%
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Slope */}
            <div className="form-group">
              <label>Average Slope (°)</label>

              <input
                type="number"
                name="slope"
                value={formData.slope}
                onChange={handleChange}
                min="0"
                max="90"
                step="0.1"
                required
              />
            </div>

            {/* Elevation */}
            <div className="form-group">
              <label>Elevation (m)</label>

              <input
                type="number"
                name="elevation"
                value={formData.elevation}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>

            {/* Live values */}
            <div className="live-data-preview">
              <div>
                <span>Live Rainfall</span>
                <strong>{formData.rainfall} mm</strong>
              </div>

              <div>
                <span>Live Soil Moisture</span>
                <strong>
                  {Number(formData.soil_moisture).toFixed(1)}%
                </strong>
              </div>
            </div>

            {/* Predict */}
            <button
              type="submit"
              className="prediction-button"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Predict Landslide Risk"}
            </button>
          </form>
        </div>

        {/* Prediction Result */}
        <div className="prediction-result-card">
          <div className="card-header">
            <div className="robot-icon">📊</div>

            <div>
              <h2>Prediction Result</h2>
              <p>AI-generated landslide risk assessment</p>
            </div>
          </div>

          {!prediction ? (
            <div className="no-result">
              <div className="no-result-icon">🤖</div>

              <h3>No Prediction Available</h3>

              <p>
                Enter a location and generate a prediction to see
                the landslide risk assessment.
              </p>
            </div>
          ) : (
            <>
              <div className="result-label">
                Latest AI Prediction
              </div>

              <div className="risk-score">
                {Number(riskScore).toFixed(0)}%
              </div>

              <div className="risk-badge">
                {riskLevel}
              </div>

              <div className="result-grid">
                <div className="result-box">
                  <span>📍 Location</span>
                  <strong>
                    {prediction.location || formData.location}
                  </strong>
                </div>

                <div className="result-box">
                  <span>🌧️ Rainfall</span>
                  <strong>
                    {prediction.rainfall ?? formData.rainfall} mm
                  </strong>
                </div>

                <div className="result-box">
                  <span>⛰️ Slope</span>
                  <strong>
                    {prediction.slope ?? formData.slope}°
                  </strong>
                </div>

                <div className="result-box">
                  <span>💧 Soil Moisture</span>
                  <strong>
                    {prediction.soilMoisture ??
                      prediction.soil_moisture ??
                      Number(formData.soil_moisture).toFixed(1)}
                    %
                  </strong>
                </div>

                <div className="result-box">
                  <span>📏 Elevation</span>
                  <strong>
                    {prediction.elevation ?? formData.elevation} m
                  </strong>
                </div>
              </div>

              <div className="result-actions">
                <button
                  className="action-button"
                  onClick={() => navigate("/risk-map")}
                >
                  View Risk Map
                </button>

                <button
                  className="action-button"
                  onClick={() => navigate("/alerts")}
                >
                  View Alerts
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Source */}
      <div className="prediction-source">
        <strong>🌐 Environmental Data:</strong>

        <span>
          Live weather data is retrieved through the SURAKSHA-AI
          backend and used as an input for risk prediction.
        </span>
      </div>
    </div>
  );
};

export default Predictions;