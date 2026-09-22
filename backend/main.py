from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI(
    title="SURAKSHA-AI API",
    description="AI-Based Landslide Risk Monitoring System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://suraksha-ai-weld.vercel.app/"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionInput(BaseModel):
    location: str
    rainfall: float
    slope: float
    soilMoisture: float
    elevation: float


@app.get("/")
def home():
    return {
        "message": "SURAKSHA-AI Backend is running",
        "status": "online"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict(data: PredictionInput):

    rainfall_risk = min(
        (data.rainfall / 150) * 40,
        40
    )

    slope_risk = min(
        (data.slope / 45) * 30,
        30
    )

    soil_risk = min(
        (data.soilMoisture / 100) * 20,
        20
    )

    elevation_risk = min(
        (data.elevation / 3000) * 10,
        10
    )

    score = round(
        rainfall_risk +
        slope_risk +
        soil_risk +
        elevation_risk
    )

    if score < 35:
        risk_level = "Low"
    elif score < 65:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    return {
        "location": data.location,
        "score": score,
        "riskLevel": risk_level,
        "rainfall": data.rainfall,
        "slope": data.slope,
        "soilMoisture": data.soilMoisture,
        "elevation": data.elevation
    }
@app.get("/weather")
async def get_weather(location: str):
    async with httpx.AsyncClient() as client:

        geo_response = await client.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={
                "name": location,
                "count": 1,
                "language": "en",
                "format": "json"
            }
        )

        geo_response.raise_for_status()
        geo_data = geo_response.json()

        if not geo_data.get("results"):
            return {
                "error": "Location not found"
            }

        place = geo_data["results"][0]

        latitude = place["latitude"]
        longitude = place["longitude"]

        weather_response = await client.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m",
                "hourly": "soil_moisture_0_to_1cm",
                "timezone": "auto"
            }
        )

        weather_response.raise_for_status()
        weather_data = weather_response.json()

        return {
            "location": place["name"],
            "latitude": latitude,
            "longitude": longitude,
            "temperature": weather_data["current"]["temperature_2m"],
            "humidity": weather_data["current"]["relative_humidity_2m"],
            "precipitation": weather_data["current"]["precipitation"],
            "rainfall": weather_data["current"]["rain"],
            "wind_speed": weather_data["current"]["wind_speed_10m"],
            "soil_moisture": weather_data["hourly"]["soil_moisture_0_to_1cm"][0],
            "timezone": weather_data["timezone"]
        }
@app.get("/terrain")
async def get_terrain(latitude: float, longitude: float):

    # Nearby points (~100 m around the selected location)
    offset = 0.001

    points_lat = [
        latitude,
        latitude + offset,
        latitude - offset,
        latitude,
        latitude
    ]

    points_lon = [
        longitude,
        longitude,
        longitude,
        longitude + offset,
        longitude - offset
    ]

    async with httpx.AsyncClient() as client:

        response = await client.get(
            "https://api.open-meteo.com/v1/elevation",
            params={
                "latitude": ",".join(map(str, points_lat)),
                "longitude": ",".join(map(str, points_lon))
            }
        )

        response.raise_for_status()

        data = response.json()
        elevations = data["elevation"]

        center = elevations[0]
        north = elevations[1]
        south = elevations[2]
        east = elevations[3]
        west = elevations[4]

        # Approximate terrain gradient
        north_south_distance = 222.0
        east_west_distance = 222.0

        dz_dy = (north - south) / north_south_distance
        dz_dx = (east - west) / east_west_distance

        gradient = (dz_dx ** 2 + dz_dy ** 2) ** 0.5

        import math
        slope = math.degrees(math.atan(gradient))

        return {
            "latitude": latitude,
            "longitude": longitude,
            "elevation": center,
            "slope": round(slope, 2)
        }