const button = document.getElementById("submit");
const cityInput = document.getElementById("cityInput");

button.addEventListener("click", function (e) {
  e.preventDefault();

  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city");
    return;
  }

  getWeather(city);
});

function getWeatherCondition(code) {
  const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Snow Fall",
    80: "Rain Showers",
    95: "Thunderstorm",
  };

  return weatherCodes[code] || "Unknown";
}

function getWindType(speed) {
  if (speed < 5) return "Light Breeze";
  if (speed < 15) return "Moderate Breeze";
  if (speed < 30) return "Strong Wind";
  return "Stormy";
}

function getWindDirection(degree) {
  if (degree >= 337.5 || degree < 22.5) return "North ↑";
  if (degree >= 22.5 && degree < 67.5) return "North-East ↗";
  if (degree >= 67.5 && degree < 112.5) return "East →";
  if (degree >= 112.5 && degree < 157.5) return "South-East ↘";
  if (degree >= 157.5 && degree < 202.5) return "South ↓";
  if (degree >= 202.5 && degree < 247.5) return "South-West ↙";
  if (degree >= 247.5 && degree < 292.5) return "West ←";
  return "North-West ↖";
}

function getWindLevel(speed) {
  if (speed < 10) return "Calm";
  if (speed < 20) return "Moderate";
  if (speed < 30) return "Strong";
  return "Extreme";
}

const guideSection = document.getElementById("guide");

const guideObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {

      if (entry.isIntersecting) {

        guideSection.classList.remove("animate-guide");

        void guideSection.offsetWidth;

        guideSection.classList.add("animate-guide");
      }

    });
  },
  {
    threshold: 0.35,
  }
);

guideObserver.observe(guideSection);


async function getWeather(city) {
  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found");
      return;
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const cityNameResult = geoData.results[0].name;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
    );

    const weatherData = await weatherResponse.json();

    const condition = getWeatherCondition(weatherData.current.weather_code);
    const temperature = weatherData.current.temperature_2m;
    const humidity = weatherData.current.relative_humidity_2m;
    const windSpeed = weatherData.current.wind_speed_10m;
    const high = weatherData.daily.temperature_2m_max[0];
    const low = weatherData.daily.temperature_2m_min[0];
    const windDirection = getWindDirection(weatherData.current.wind_direction_10m);

    const sunrise = new Date(weatherData.daily.sunrise[0]).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const sunset = new Date(weatherData.daily.sunset[0]).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    document.getElementById("cityName").innerText = `Weather of ${cityNameResult}`;
    document.getElementById("temp").innerText = temperature + "°C";
    document.getElementById("humidity").innerText = humidity + "%";
    document.getElementById("wind").innerText = windSpeed + " km/h";
    document.getElementById("condition").innerText = condition;
    document.getElementById("high").innerText = high + "°C";
    document.getElementById("low").innerText = low + "°C";
    document.getElementById("direction").innerText = windDirection;
    document.getElementById("windLevel").innerText = getWindLevel(windSpeed);
    document.getElementById("windType").innerText = getWindType(windSpeed);
    document.getElementById("sunrise").innerText = sunrise;
    document.getElementById("sunset").innerText = sunset;


  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
}

async function loadPopularCity(city, tempId, conditionId) {
  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      document.getElementById(conditionId).innerText = "City not found";
      return;
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
    );

    const weatherData = await weatherResponse.json();

    document.getElementById(tempId).innerText =
      weatherData.current.temperature_2m + "°C";

    document.getElementById(conditionId).innerText =
      getWeatherCondition(weatherData.current.weather_code);

  } catch (error) {
    console.log(error);
    document.getElementById(conditionId).innerText = "Unable to load";
  }
}
loadPopularCity("Mumbai", "mumbaiTemp", "mumbaiCondition");
loadPopularCity("Tokyo", "tokyoTemp", "tokyoCondition");
loadPopularCity("London", "londonTemp", "londonCondition");