import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard() {

  const navigate = useNavigate()

  const [prediction, setPrediction] = useState(null)

  useEffect(() => {
    const savedPrediction =
      localStorage.getItem("surakshaPrediction")

    if (savedPrediction) {
      setPrediction(JSON.parse(savedPrediction))
    }
  }, [])

  const alerts = [
    {
      location: "Gangtok",
      level: "High",
      score: 84,
      time: "10 min ago"
    },
    {
      location: "Aizawl",
      level: "High",
      score: 78,
      time: "25 min ago"
    },
    {
      location: "Guwahati",
      level: "Moderate",
      score: 62,
      time: "1 hour ago"
    }
  ]

  const currentScore = prediction
    ? prediction.score
    : 72

  const currentRisk = prediction
    ? prediction.riskLevel
    : "Moderate"

  return (
    <div className="dashboard-page">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <h1>Welcome to SURAKSHA-AI</h1>

          <p>
            AI-powered early warning and landslide risk
            monitoring for the Northeast Region of India.
          </p>
        </div>

        <button
          className="map-button"
          onClick={() => navigate("/risk-map")}
        >
          View Risk Map →
        </button>

      </div>

      {/* Risk Cards */}

      <div className="risk-cards">

        <div className="risk-card">

          <p>Current Risk Level</p>

          <h2>{currentScore}%</h2>

          <span>
            {currentRisk} Risk
          </span>

        </div>

        <div className="risk-card">

          <p>Active Alerts</p>

          <h2>08</h2>

          <span>
            Requires attention
          </span>

        </div>

        <div className="risk-card">

          <p>Monitored Areas</p>

          <h2>24</h2>

          <span>
            Villages & Roads
          </span>

        </div>

        <div className="risk-card">

          <p>Model Accuracy</p>

          <h2>94%</h2>

          <span>
            AI prediction model
          </span>

        </div>

      </div>

      {/* Latest Prediction */}

      {prediction && (

        <div className="dashboard-latest-prediction">

          <div>

            <span>
              🤖 Latest AI Prediction
            </span>

            <h3>
              {prediction.location}
            </h3>

          </div>

          <div className="dashboard-prediction-details">

            <div>
              <small>Risk Score</small>
              <strong>{prediction.score}%</strong>
            </div>

            <div>
              <small>Risk Level</small>
              <strong>{prediction.riskLevel}</strong>
            </div>

            <div>
              <small>Rainfall</small>
              <strong>{prediction.rainfall} mm</strong>
            </div>

            <div>
              <small>Soil Moisture</small>
              <strong>{prediction.soilMoisture}%</strong>
            </div>

          </div>

        </div>

      )}

      {/* Main Grid */}

      <div className="dashboard-grid">

        {/* Risk Overview */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h3>
                🗺️ Landslide Risk Overview
              </h3>

              <p>
                Current risk distribution across
                monitored locations.
              </p>

            </div>

            <button
              className="small-button"
              onClick={() => navigate("/risk-map")}
            >
              Open Map
            </button>

          </div>

          <div className="risk-overview">

            <div className="overview-circle">

              <strong>
                {currentScore}%
              </strong>

              <span>
                Risk Score
              </span>

            </div>

            <div className="overview-details">

              <div>
                <span className="overview-dot high-dot"></span>
                <span>High Risk</span>
                <strong>02</strong>
              </div>

              <div>
                <span className="overview-dot moderate-dot"></span>
                <span>Moderate Risk</span>
                <strong>01</strong>
              </div>

              <div>
                <span className="overview-dot low-dot"></span>
                <span>Low Risk</span>
                <strong>01</strong>
              </div>

            </div>

          </div>

        </div>

        {/* Environmental Conditions */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h3>
                🌍 Environmental Conditions
              </h3>

              <p>
                Latest monitored environmental parameters.
              </p>

            </div>

          </div>

          <div className="environment-item">
            <span>🌧️ Rainfall</span>
            <strong>
              {prediction
                ? `${prediction.rainfall} mm`
                : "84 mm"}
            </strong>
          </div>

          <div className="environment-item">
            <span>⛰️ Average Slope</span>
            <strong>
              {prediction
                ? `${prediction.slope}°`
                : "38°"}
            </strong>
          </div>

          <div className="environment-item">
            <span>🌱 Soil Moisture</span>
            <strong>
              {prediction
                ? `${prediction.soilMoisture}%`
                : "76%"}
            </strong>
          </div>

          <div className="environment-item">
            <span>💧 Groundwater</span>
            <strong>64%</strong>
          </div>

        </div>

      </div>

      {/* Bottom Grid */}

      <div className="dashboard-bottom-grid">

        {/* Recent Alerts */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h3>
                🚨 Recent Alerts
              </h3>

              <p>
                Latest detected risk conditions.
              </p>

            </div>

            <button
              className="small-button"
              onClick={() => navigate("/alerts")}
            >
              View All
            </button>

          </div>

          <div className="dashboard-alert-list">

            {alerts.map((alert) => (

              <div
                className={`dashboard-alert ${alert.level.toLowerCase()}`}
                key={alert.location}
              >

                <div className="dashboard-alert-icon">
                  {alert.level === "High"
                    ? "🚨"
                    : "⚠️"}
                </div>

                <div className="dashboard-alert-info">

                  <strong>
                    {alert.location}
                  </strong>

                  <span>
                    {alert.level} Risk • {alert.score}%
                  </span>

                </div>

                <small>
                  {alert.time}
                </small>

              </div>

            ))}

          </div>

        </div>

        {/* AI Monitoring */}

        <div className="dashboard-panel ai-panel">

          <div className="ai-icon">
            🤖
          </div>

          <h3>
            AI Monitoring System
          </h3>

          <p>
            SURAKSHA-AI continuously analyzes
            environmental conditions to identify
            potential landslide risk and support
            early warning decisions.
          </p>

          <div className="ai-status">

            <span></span>

            AI System Active

          </div>

          <button
            className="prediction-button"
            onClick={() => navigate("/predictions")}
          >
            Run Risk Prediction →
          </button>

        </div>

      </div>

    </div>
  )
}

export default Dashboard