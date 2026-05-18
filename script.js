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
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    const weatherData = await weatherResponse.json();

    document.getElementById("cityName").innerText =
      `Weather of ${cityNameResult}`;

    document.getElementById("temp").innerText =
      weatherData.current.temperature_2m + "°C";

    document.getElementById("humidity").innerText =
      weatherData.current.relative_humidity_2m + "%";

    document.getElementById("wind").innerText =
      weatherData.current.wind_speed_10m + " km/h";

    document.getElementById("condition").innerText =
      weatherData.current.weather_code;

    document.getElementById("high").innerText =
      weatherData.daily.temperature_2m_max[0] + "°C";

    document.getElementById("low").innerText =
      weatherData.daily.temperature_2m_min[0] + "°C";

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
}