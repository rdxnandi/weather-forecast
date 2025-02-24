import React, { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

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

  // const weatherCode = weather.weather[0].icon;
  // const weatherIcon = allIcons[weatherCode] || clear_icon;

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
          <div className="mt-6 p-6 w-80 bg-transparent flex flex-col items-center rounded-2xl">
            <h2 className="text-2xl font-bold mt-2">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-lg capitalize mt-1">
              {weather.weather[0].description}
            </p>
            <h3 className="text-4xl font-semibold mt-2">
              {weather.main.temp}℃
            </h3>
            <div className="flex justify-between w-full mt-4 px-4">
              <div className="text-center">
                <p className="text-sm">Humidity</p>
                <p className="text-lg font-semibold">
                  {weather.main.humidity}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm">Wind Speed</p>
                <p className="text-lg font-semibold">
                  {weather.wind.speed} m/s
                </p>
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
