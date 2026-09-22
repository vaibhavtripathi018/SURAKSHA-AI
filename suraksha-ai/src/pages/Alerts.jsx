import { useEffect, useState } from "react"

function Alerts() {

  const [prediction, setPrediction] = useState(null)

  useEffect(() => {

    const savedPrediction =
      localStorage.getItem("surakshaPrediction")

    if (savedPrediction) {
      setPrediction(JSON.parse(savedPrediction))
    }

  }, [])


  // Latest prediction ko alert me convert karna
  const alerts = prediction
    ? [
        {
          location: prediction.location,
          level: prediction.riskLevel,
          score: prediction.score,

          message:
            prediction.riskLevel === "High"
              ? "High landslide risk detected. Immediate monitoring required."
              : prediction.riskLevel === "Moderate"
              ? "Moderate landslide risk detected. Monitoring required."
              : "Risk level currently within low range.",

          time: "Just now"
        }
      ]
    : []


  const getAlertClass = (level) => {

    if (level === "High") return "high"

    if (level === "Moderate") return "moderate"

    return "low"

  }


  return (

    <div className="alerts-page">


      {/* PAGE HEADER */}

      <div className="page-title">

        <div>

          <h1>
            Early Warning Alerts
          </h1>

          <p>
            Monitor landslide risk alerts across
            monitored locations.
          </p>

        </div>

      </div>


      {/* LATEST AI PREDICTION */}

      {prediction && (

        <div className="latest-alert">

          <div className="latest-alert-icon">
            🚨
          </div>


          <div className="latest-alert-content">

            <span>
              🤖 Latest AI Prediction
            </span>

            <h3>
              {prediction.location}
            </h3>

            <p>
              {prediction.riskLevel} Risk detected with
              a predicted score of {prediction.score}%.
            </p>

          </div>


          <div
            className={`latest-alert-score ${getAlertClass(
              prediction.riskLevel
            )}`}
          >
            {prediction.score}%
          </div>

        </div>

      )}


      {/* ALERT SUMMARY */}

      <div className="alert-summary">


        {/* HIGH */}

        <div className="summary-card">

          <span>
            🚨
          </span>

          <div>

            <strong>
              {prediction?.riskLevel === "High"
                ? "01"
                : "00"}
            </strong>

            <small>
              High Risk
            </small>

          </div>

        </div>


        {/* MODERATE */}

        <div className="summary-card">

          <span>
            ⚠️
          </span>

          <div>

            <strong>
              {prediction?.riskLevel === "Moderate"
                ? "01"
                : "00"}
            </strong>

            <small>
              Moderate Risk
            </small>

          </div>

        </div>


        {/* LOW */}

        <div className="summary-card">

          <span>
            ✅
          </span>

          <div>

            <strong>
              {prediction?.riskLevel === "Low"
                ? "01"
                : "00"}
            </strong>

            <small>
              Low Risk
            </small>

          </div>

        </div>


        {/* MONITORED AREAS */}

        <div className="summary-card">

          <span>
            📍
          </span>

          <div>

            <strong>
              {prediction ? "01" : "00"}
            </strong>

            <small>
              Monitored Areas
            </small>

          </div>

        </div>

      </div>


      {/* RECENT ALERTS */}

      <div className="alerts-list">


        <div className="panel-header">

          <div>

            <h3>
              🚨 Recent Alerts
            </h3>

            <p>
              Latest detected landslide risk conditions.
            </p>

          </div>

        </div>


        {alerts.length > 0 ? (

          alerts.map((alert) => (

            <div
              className={`alert-item ${alert.level.toLowerCase()}`}
              key={alert.location}
            >


              <div className="alert-icon">

                {alert.level === "High"
                  ? "🚨"
                  : alert.level === "Moderate"
                  ? "⚠️"
                  : "✅"}

              </div>


              <div className="alert-info">


                <div className="alert-top">

                  <h3>
                    {alert.location}
                  </h3>

                  <span className="alert-level">
                    {alert.level} Risk
                  </span>

                </div>


                <p>
                  {alert.message}
                </p>


                <small>

                  Risk Score:

                  <strong>
                    {" "}
                    {alert.score}%
                  </strong>

                  {" • "}

                  {alert.time}

                </small>


              </div>

            </div>

          ))

        ) : (

          <div className="alert-item low">

            <div className="alert-icon">
              ℹ️
            </div>

            <div className="alert-info">

              <h3>
                No Prediction Available
              </h3>

              <p>
                Run a prediction from the Predictions
                page to generate an alert.
              </p>

            </div>

          </div>

        )}


      </div>


    </div>

  )

}


export default Alerts