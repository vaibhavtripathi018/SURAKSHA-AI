import { useEffect, useState } from "react"

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from "react-leaflet"

import "leaflet/dist/leaflet.css"


function MapController({ coordinates }) {

  const map = useMap()

  useEffect(() => {

    if (coordinates) {

      map.setView(
        [coordinates.lat, coordinates.lon],
        10,
        {
          animate: true
        }
      )

    }

  }, [coordinates, map])

  return null
}


function RiskMap() {

  const [prediction, setPrediction] = useState(null)

  const [coordinates, setCoordinates] = useState(null)

  const [loading, setLoading] = useState(false)

  const [locationError, setLocationError] = useState("")


  useEffect(() => {

    const savedPrediction =
      localStorage.getItem("surakshaPrediction")

    if (savedPrediction) {

      setPrediction(
        JSON.parse(savedPrediction)
      )

    }

  }, [])

  useEffect(() => {

  if (!prediction) {
    return
  }

  // Use exact coordinates saved from live weather
  if (prediction.latitude && prediction.longitude) {

    setCoordinates({
      lat: Number(prediction.latitude),
      lon: Number(prediction.longitude),
      displayName: prediction.weatherLocation || prediction.location
    })

    return
  }

  // Fallback: search location if coordinates are not available
  if (!prediction.location) {
    return
  }

  const findLocation = async () => {

    setLoading(true)
    setLocationError("")

    try {

      const query = `${prediction.location}, India`

      const url =
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}` +
        `&format=jsonv2` +
        `&limit=1` +
        `&countrycodes=in`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Location search failed")
      }

      const data = await response.json()

      if (data.length === 0) {

        setCoordinates(null)

        setLocationError(
          `Location "${prediction.location}" was not found on the map.`
        )

        return
      }

      setCoordinates({
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
        displayName: data[0].display_name
      })

    } catch (error) {

      console.error(error)

      setCoordinates(null)

      setLocationError(
        "Unable to find this location right now."
      )

    } finally {

      setLoading(false)

    }

  }

  findLocation()

  }, [prediction])


  const getColor = (level) => {

    if (level === "High") {
      return "#ef4444"
    }

    if (level === "Moderate") {
      return "#f59e0b"
    }

    return "#22c55e"

  }


  return (

    <div className="risk-map-page">


      <div className="page-title">

        <div>

          <h1>Landslide Risk Map</h1>

          <p>
            GIS-based visualization of landslide risk
            across monitored locations.
          </p>

        </div>

      </div>


      {prediction && (

        <div className="map-prediction-banner">

          <div>

            <span>
              🤖 Latest AI Prediction
            </span>

            <strong>
              {prediction.location}
            </strong>

          </div>


          <div className="map-prediction-score">

            <span>
              Risk Score
            </span>

            <strong
              style={{
                color: getColor(
                  prediction.riskLevel
                )
              }}
            >
              {prediction.score}%
            </strong>

            <small>
              {prediction.riskLevel} Risk
            </small>

          </div>

        </div>

      )}


      {loading && (

        <div className="map-prediction-banner">

          <div>

            <span>
              📍 Finding location...
            </span>

            <strong>
              {prediction?.location}
            </strong>

          </div>

        </div>

      )}


      {locationError && (

        <div className="map-prediction-banner">

          <div>

            <span>
              ⚠️ Map Location
            </span>

            <strong>
              {locationError}
            </strong>

          </div>

        </div>

      )}


      <div className="map-container">

        <MapContainer

          center={[25.8, 91.8]}

          zoom={6}

          style={{
            height: "600px",
            width: "100%"
          }}

        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {coordinates && (

            <>

              <MapController
                coordinates={coordinates}
              />


              <CircleMarker

                center={[
                  coordinates.lat,
                  coordinates.lon
                ]}

                radius={20}

                pathOptions={{

                  color: "#38bdf8",

                  fillColor:
                    getColor(
                      prediction.riskLevel
                    ),

                  fillOpacity: 0.9,

                  weight: 4

                }}

              >

                <Popup>

                  <div className="risk-popup">

                    <h3>
                      {prediction.location}
                    </h3>

                    <p>
                      🤖 AI Prediction
                    </p>

                    <p>
                      Risk Level:
                      <strong>
                        {" "}
                        {prediction.riskLevel}
                      </strong>
                    </p>

                    <p>
                      Risk Score:
                      <strong>
                        {" "}
                        {prediction.score}%
                      </strong>
                    </p>

                    <hr />

                    <p>
                      🌧️ Rainfall:
                      <strong>
                        {" "}
                        {prediction.rainfall} mm
                      </strong>
                    </p>

                    <p>
                      ⛰️ Slope:
                      <strong>
                        {" "}
                        {prediction.slope}°
                      </strong>
                    </p>

                    <p>
                      🌱 Soil Moisture:
                      <strong>
                        {" "}
                        {prediction.soilMoisture}%
                      </strong>
                    </p>

                    <p>
                      🏔️ Elevation:
                      <strong>
                        {" "}
                        {prediction.elevation} m
                      </strong>
                    </p>

                  </div>

                </Popup>

              </CircleMarker>

            </>

          )}

        </MapContainer>


        <div className="map-legend">

          <h4>
            Risk Level
          </h4>

          <div>
            <span className="legend-dot low"></span>
            Low Risk
          </div>

          <div>
            <span className="legend-dot moderate"></span>
            Moderate Risk
          </div>

          <div>
            <span className="legend-dot high"></span>
            High Risk
          </div>

        </div>

      </div>

    </div>

  )

}


export default RiskMap