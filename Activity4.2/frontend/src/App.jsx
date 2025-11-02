import { useState, useEffect } from "react";
import { Sun, CloudRain, Cloud, Snowflake } from "lucide-react";
import reactLogo from "./assets/react.svg";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [localTime, setLocalTime] = useState("");
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const res = await fetch(`http://localhost:3000/weather?city=${city}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setWeather(data);
      updateLocalTime(data.timezone);
      setError("");
    } catch (err) {
      setError("City not found or API request failed.");
      setWeather(null);
    }
  };

  const updateLocalTime = (timezoneOffset) => {
    const utcNow = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
    const local = new Date(utcNow.getTime() + timezoneOffset * 1000);
    setLocalTime(
      local.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  useEffect(() => {
    if (weather) {
      const interval = setInterval(() => updateLocalTime(weather.timezone), 1000);
      return () => clearInterval(interval);
    }
  }, [weather]);

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud size={48} color="#2563eb" />;
    const text = condition.toLowerCase();
    if (text.includes("rain")) return <CloudRain size={48} color="#2563eb" />;
    if (text.includes("snow")) return <Snowflake size={48} color="#2563eb" />;
    if (text.includes("clear")) return <Sun size={48} color="#facc15" />;
    return <Cloud size={48} color="#2563eb" />;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#e0f2fe",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "420px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <img src={reactLogo} alt="React" style={{ width: 32 }} />
          <h1 style={{ color: "#2563eb", fontSize: "1.8rem", fontWeight: "bold" }}>
            Weather Proxy App
          </h1>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{
              flex: 1,
              padding: "0.7rem",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#222",
              color: "white",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={fetchWeather}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "0.7rem 1.2rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Search
          </button>
        </div>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        {weather && (
          <div
            style={{
              background: "#eff6ff",
              padding: "1.5rem",
              marginTop: "1.5rem",
              borderRadius: "1rem",
            }}
          >
            {getWeatherIcon(weather.condition)}
            <h2 style={{ color: "#1e3a8a", fontWeight: "bold", marginTop: "0.5rem" }}>
              {weather.city}, {weather.country}
            </h2>
            <h3 style={{ fontSize: "1.8rem", color: "#1e40af", margin: "0.3rem 0" }}>
              {weather.temperature.toFixed(1)}°C
            </h3>
            <p style={{ textTransform: "capitalize", margin: 0 }}>{weather.condition}</p>
            <p style={{ color: "#1e3a8a", marginTop: "0.6rem", fontWeight: "bold" }}>
              🕒 Local Time: {localTime}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
