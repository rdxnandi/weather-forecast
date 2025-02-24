import React, { useState } from "react";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const weatherIcons = {
    Clear: clear_icon,
    Cloud: cloud_icon,
    Drizzle: drizzle_icon,
    Rain: rain_icon,
    Snow: snow_icon,
    Wind: wind_icon,
  };

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();
      if (weatherData.cod !== 200) {
        alert("City not found!");
        return;
      }
      setWeather(weatherData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastResponse.json();

      const dailyForecast = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);
    } catch (error) {
      // console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-[#212121]">
      <h1 className="text-2xl font-bold mb-4 text-white">Weather Report</h1>
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="p-2 border border-white rounded outline-none placeholder:text-white text-white"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={fetchWeather}
        >
          Search
        </button>
      </div>

      <div className="rounded-lg w-full flex items-center flex-col text-white">
        {/* Current Weather */}
        {weather && (
          <div className="mt-6 p-6 w-96 bg-transparent flex flex-col items-center rounded-2xl">
            <h2 className="text-2xl font-bold mt-2">
              {weather.name}, {weather.sys.country}
            </h2>
            <img
              src={weatherIcons[weather.weather[0].main] || clear_icon}
              alt={weather.weather[0].main}
              className="w-20"
            />
            <p className="text-lg capitalize mt-1">
              {weather.weather[0].description}
            </p>
            <h3 className="text-4xl font-semibold mt-2">
              {weather.main.temp}℃
            </h3>
            <div className="flex justify-between w-full mt-4">
              <div className="text-center flex items-center gap-3">
                <img src={humidity_icon} alt="" className="w-5 h-5" />
                <div className="flex flex-col">
                  <p className="text-sm">Humidity</p>
                  <p className="text-lg font-semibold">
                    {weather.main.humidity}%
                  </p>
                </div>
              </div>
              <div className="text-center flex items-center gap-3">
                <img src={wind_icon} alt="" className="w-5 h-5" />
                <div className="flex flex-col">
                  <p className="text-sm">Wind Speed</p>
                  <p className="text-lg font-semibold">
                    {weather.wind.speed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div className="mt-6">
            <div className="flex w-full gap-7">
              {forecast.map((day) => (
                <div
                  key={day.dt}
                  className="p-4 rounded-lg flex flex-col items-center my-7"
                >
                  <p className="text-white font-semibold">
                    {new Date(day.dt_txt).toLocaleDateString("en-us", {
                      weekday: "short",
                    })}
                  </p>
                  <img
                    src={weatherIcons[day.weather[0].main] || clear_icon}
                    alt={day.weather[0].main}
                    className="w-20"
                  />
                  <p className="text-white">{day.weather[0].description}</p>
                  <p className="text-lg font-bold">{day.main.temp}℃</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
