import { useEffect, useState } from "react"

function Analytics() {

  const [prediction, setPrediction] = useState(null)

  useEffect(() => {

    const savedPrediction =
      localStorage.getItem("surakshaPrediction")

    if (savedPrediction) {
      setPrediction(JSON.parse(savedPrediction))
    }

  }, [])


  const getColor = (level) => {

    if (level === "High") {
      return "#ef4444"
    }

    if (level === "Moderate") {
      return "#f59e0b"
    }

    return "#22c55e"
  }


  const getRiskDistribution = () => {

    if (!prediction) {
      return {
        high: 0,
        moderate: 0,
        low: 0
      }
    }

    if (prediction.riskLevel === "High") {
      return {
        high: 100,
        moderate: 0,
        low: 0
      }
    }

    if (prediction.riskLevel === "Moderate") {
      return {
        high: 0,
        moderate: 100,
        low: 0
      }
    }

    return {
      high: 0,
      moderate: 0,
      low: 100
    }
  }


  const distribution = getRiskDistribution()


  return (

    <div className="analytics-page">

      {/* PAGE HEADER */}

      <div className="page-title">

        <div>

          <h1>Risk Analytics</h1>

          <p>
            Analyze landslide risk patterns and
            environmental conditions across monitored
            locations.
          </p>

        </div>

      </div>


      {/* LATEST AI PREDICTION */}

      {prediction && (

        <div className="analytics-prediction">

          <div>

            <span>
              🤖 Latest AI Prediction
            </span>

            <h3>
              {prediction.location}
            </h3>

          </div>


          <div className="analytics-prediction-details">

            <div>

              <small>
                Risk Score
              </small>

              <strong
                style={{
                  color: getColor(prediction.riskLevel)
                }}
              >
                {prediction.score}%
              </strong>

            </div>


            <div>

              <small>
                Risk Level
              </small>

              <strong>
                {prediction.riskLevel}
              </strong>

            </div>


            <div>

              <small>
                Rainfall
              </small>

              <strong>
                {prediction.rainfall} mm
              </strong>

            </div>


            <div>

              <small>
                Slope
              </small>

              <strong>
                {Number(prediction.slope).toFixed(2)}°
              </strong>

            </div>

          </div>

        </div>

      )}


      {/* SUMMARY CARDS */}

      <div className="analytics-summary">


        <div className="analytics-card">

          <span>💧</span>

          <div>

            <strong>
              {prediction
                ? `${Number(prediction.soilMoisture).toFixed(1)}%`
                : "--"}
            </strong>

            <small>
              Soil Moisture
            </small>

          </div>

        </div>


        <div className="analytics-card">

          <span>🌧️</span>

          <div>

            <strong>
              {prediction
                ? `${prediction.rainfall} mm`
                : "--"}
            </strong>

            <small>
              Rainfall
            </small>

          </div>

        </div>


        <div className="analytics-card">

          <span>🚨</span>

          <div>

            <strong>
              {prediction?.riskLevel === "High"
                ? "01"
                : "00"}
            </strong>

            <small>
              High Risk Areas
            </small>

          </div>

        </div>


        <div className="analytics-card">

          <span>🤖</span>

          <div>

            <strong>
              Active
            </strong>

            <small>
              Prediction Engine
            </small>

          </div>

        </div>

      </div>


      {/* ANALYTICS GRID */}

      <div className="analytics-grid">


        {/* RISK DISTRIBUTION */}

        <div className="analytics-panel">

          <h3>
            Risk Distribution
          </h3>


          <div className="risk-distribution">


            <div className="distribution-item">

              <div className="distribution-label">

                <span>
                  High Risk
                </span>

                <strong>
                  {distribution.high}%
                </strong>

              </div>

              <div className="distribution-bar">

                <div
                  className="distribution-fill high"
                  style={{
                    width: `${distribution.high}%`
                  }}
                ></div>

              </div>

            </div>


            <div className="distribution-item">

              <div className="distribution-label">

                <span>
                  Moderate Risk
                </span>

                <strong>
                  {distribution.moderate}%
                </strong>

              </div>

              <div className="distribution-bar">

                <div
                  className="distribution-fill moderate"
                  style={{
                    width: `${distribution.moderate}%`
                  }}
                ></div>

              </div>

            </div>


            <div className="distribution-item">

              <div className="distribution-label">

                <span>
                  Low Risk
                </span>

                <strong>
                  {distribution.low}%
                </strong>

              </div>

              <div className="distribution-bar">

                <div
                  className="distribution-fill low"
                  style={{
                    width: `${distribution.low}%`
                  }}
                ></div>

              </div>

            </div>

          </div>

        </div>


        {/* ENVIRONMENTAL CONDITIONS */}

        <div className="analytics-panel">

          <h3>
            Environmental Conditions
          </h3>


          <div className="environment-stat">

            <span>
              🌧️ Rainfall
            </span>

            <strong>
              {prediction
                ? `${prediction.rainfall} mm`
                : "--"}
            </strong>

          </div>


          <div className="environment-stat">

            <span>
              ⛰️ Slope
            </span>

            <strong>
              {prediction
                ? `${Number(prediction.slope).toFixed(2)}°`
                : "--"}
            </strong>

          </div>


          <div className="environment-stat">

            <span>
              🌱 Soil Moisture
            </span>

            <strong>
              {prediction
                ? `${Number(prediction.soilMoisture).toFixed(1)}%`
                : "--"}
            </strong>

          </div>


          <div className="environment-stat">

            <span>
              🏔️ Elevation
            </span>

            <strong>
              {prediction
                ? `${prediction.elevation} m`
                : "--"}
            </strong>

          </div>

        </div>

      </div>


      {/* MONITORED LOCATIONS */}

      <div className="analytics-panel location-panel">

        <div className="panel-header">

          <div>

            <h3>
              📍 Monitored Locations
            </h3>

            <p>
              Current AI risk score across monitored areas.
            </p>

          </div>

        </div>


        {prediction ? (

          <div className="location-row">

            <div className="location-name">

              <strong>
                {prediction.location}
              </strong>

              <span>
                {prediction.riskLevel} Risk
              </span>

            </div>


            <div className="location-progress">

              <div className="location-bar">

                <div
                  style={{
                    width: `${prediction.score}%`,
                    background: getColor(
                      prediction.riskLevel
                    )
                  }}
                ></div>

              </div>

            </div>


            <strong className="location-score">
              {prediction.score}%
            </strong>

          </div>

        ) : (

          <div className="location-row">

            <div className="location-name">

              <strong>
                No Prediction
              </strong>

              <span>
                Run a prediction first
              </span>

            </div>

          </div>

        )}

      </div>


      {/* MODEL INFORMATION */}

      <div className="model-info">

        <div className="model-info-icon">
          🤖
        </div>


        <div>

          <h3>
            AI Prediction Model
          </h3>

          <p>
            The system analyzes environmental parameters
            such as rainfall, slope, soil moisture and
            elevation to estimate landslide risk.
          </p>

        </div>


        <div className="model-accuracy">

          <span>
            Model Status
          </span>

          <strong>
            Active
          </strong>

        </div>

      </div>


    </div>

  )
}

export default Analytics