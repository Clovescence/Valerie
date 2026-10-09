import { useState, useEffect } from "react";

interface GeoData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

interface WeatherData {
  temp: number;
  condition: string;
}

const WMO_CODES: Record<number, string> = {
  0: "CLEAR SKY",
  1: "MAINLY CLEAR",
  2: "PARTLY CLOUDY",
  3: "OVERCAST",
  45: "FOG",
  48: "FOG",
  51: "DRIZZLE",
  53: "DRIZZLE",
  55: "DRIZZLE",
  61: "RAIN",
  63: "RAIN",
  65: "HEAVY RAIN",
  71: "SNOW",
  73: "SNOW",
  75: "HEAVY SNOW",
  95: "THUNDERSTORM",
  96: "THUNDERSTORM",
  99: "THUNDERSTORM",
};

export function EnvironmentWidget() {
  const [time, setTime] = useState<Date | null>(null);
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchWeatherAndCity(lat: number, lon: number, fallbackCity?: string, fallbackCountry?: string) {
      try {
        // 1. Get city from exact coordinates (Reverse Geocoding)
        let city = fallbackCity || "UNKNOWN";
        let country = fallbackCountry || "XX";
        
        try {
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            city = geoData.city || geoData.locality || city;
            country = geoData.countryCode || country;
          }
        } catch (e) {
          // ignore reverse geocode failure
        }

        if (!mounted) return;
        setGeo({ city, country, lat, lon });

        // 2. Get local weather using exact coordinates
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!weatherRes.ok) throw new Error("Weather fetch failed");
        const weatherData = await weatherRes.json();
        
        if (!mounted) return;

        const current = weatherData.current_weather;
        setWeather({
          temp: Math.round(current.temperature),
          condition: WMO_CODES[current.weathercode] || "UNKNOWN",
        });

      } catch (error) {
        console.warn("Failed to fetch environment data:", error);
      }
    }

    async function fetchIpFallback() {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        if (!ipRes.ok) return;
        const ipData = await ipRes.json();
        await fetchWeatherAndCity(ipData.latitude, ipData.longitude, ipData.city, ipData.country_code);
      } catch (e) {
        // ignore
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!mounted) return;
          fetchWeatherAndCity(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // User denied or error occurred, fallback to IP
          if (!mounted) return;
          fetchIpFallback();
        },
        { timeout: 10000 }
      );
    } else {
      fetchIpFallback();
    }

    return () => {
      mounted = false;
    };
  }, []);

  if (!time) return null;

  return (
    <div className="mb-8 flex flex-col gap-3 border-l border-sequoia-border pl-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sequoia-light/50">
      <div className="flex items-center gap-3">
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sequoia-accent opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sequoia-accent"></span>
        </span>
        <span className="text-sequoia-accent">Live / Local</span>
      </div>
      
      <div className="flex flex-col gap-1">
        <span>{time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} / {geo ? `${geo.city}, ${geo.country}` : "LOCATING..."}</span>
        <span>{geo ? `${Math.abs(geo.lat).toFixed(4)}° ${geo.lat >= 0 ? 'N' : 'S'}, ${Math.abs(geo.lon).toFixed(4)}° ${geo.lon >= 0 ? 'E' : 'W'}` : "..."}</span>
        <span>{weather ? `${weather.temp}°C — ${weather.condition}` : "OBSERVING ATMOSPHERE..."}</span>
      </div>
    </div>
  );
}
