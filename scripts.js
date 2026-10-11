const apiKey = "dab3d1327e88d079912bdd2ae64e52b5";
const apiBase = "https://api.openweathermap.org/data/2.5";

document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  search();
});

async function search() {
  const inputText = document.getElementById("search-bar").value.trim();
  if (!inputText) {
    showError("Please enter a city name.");
    return;
  }

  showError("");
  try {
    // Fetch both at once instead of hitting the forecast endpoint twice.
    const [weather, forecast] = await Promise.all([
      fetchWeatherData(inputText),
      fetchForecastData(inputText),
    ]);
    updateWeather(weather, forecast);
    updateForecast(forecast);
    try {
      localStorage.setItem("lastCity", inputText);
    } catch (e) {
      // Storage can be unavailable (private mode); remembering the city is optional.
    }
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
}

function showError(message) {
  const errorElement = document.getElementById("error");
  errorElement.innerText = message;
  errorElement.hidden = !message;
}

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 404) throw new Error("City not found. Check the spelling and try again.");
    if (response.status === 401) throw new Error("The weather service rejected the API key.");
    throw new Error(data.message || "Could not load the weather. Please try again.");
  }
  return data;
}

function fetchWeatherData(city) {
  return fetchJson(`${apiBase}/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${apiKey}`);
}

/* Fetches the 5-day / 3-hour forecast for a city. The free API returns at most 40 entries. */
function fetchForecastData(city) {
  return fetchJson(`${apiBase}/forecast?q=${encodeURIComponent(city)}&units=imperial&appid=${apiKey}`);
}

function updateWeather(data, forecast) {
  const weatherType = data.weather[0].main;
  const obj = getWeatherObj(weatherType);
  const tzOffset = data.timezone;

  const weather_dashboard = document.getElementById("weather_dashboard");
  weather_dashboard.innerHTML = `
      <h2 class="city">${escapeHtml(data.name)}, ${escapeHtml(data.sys.country || "")}</h2>
      <h3 class="time">As of ${convertTime(data.dt, tzOffset)}</h3>
      <h1 class="temp">${Math.round(data.main.temp)} °F</h1>
      <p class="feels">Feels like ${Math.round(data.main.feels_like)} °F</p>
      <p class="high">High: ${Math.round(data.main.temp_max)} °F</p>
      <p class="low">Low: ${Math.round(data.main.temp_min)} °F</p>

      <div class="flex">
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${escapeHtml(weatherType)}" class="icon" />
          <div class="description">${escapeHtml(data.weather[0].description)}</div>
      </div>

      <div class="pressure"><strong>Pressure:</strong> ${(data.main.pressure * 0.02953).toFixed(2)} in</div>
      <div class="humidity"><strong>Humidity:</strong> ${data.main.humidity}%</div>
  `;

  document.querySelector(".date").innerText = getCurrentDate(tzOffset);

  const sunrise = data.sys.sunrise || forecast.city.sunrise;
  const sunset = data.sys.sunset || forecast.city.sunset;
  document.getElementById("sunrise").innerText = `Sunrise: ${convertTime(sunrise, tzOffset)}`;
  document.getElementById("sunset").innerText = `Sunset: ${convertTime(sunset, tzOffset)}`;

  document.getElementById("wind-speed").innerText = `Wind Speed: ${Math.round(data.wind.speed)} mph`;
  document.getElementById("wind-direction").innerText =
    `Wind Direction: ${degreesToCompass(data.wind.deg)} (${data.wind.deg}°)`;

  const visibilityMiles = (data.visibility ?? 10000) / 1609.34;
  document.getElementById("vis").innerText = `Visibility: ${visibilityMiles.toFixed(1)} mi`;
  document.getElementById("tz").innerText = `Time Zone: ${convertTimezone(tzOffset)}`;

  /* Swap the background video to match the current weather. */
  const videoElement = document.getElementById("video_");
  const sourceElement = document.getElementById("source_");
  if (obj.video && sourceElement.getAttribute("src") !== obj.video) {
    sourceElement.setAttribute("src", obj.video);
    videoElement.load();
    videoElement.play().catch(() => {
      // Autoplay can be blocked (e.g. iOS low power mode); the background image still shows.
    });
  }
}

// Today's date in the searched city's time zone
function getCurrentDate(tzOffset = 0) {
  const cityNow = new Date(Date.now() + tzOffset * 1000);
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" };
  return cityNow.toLocaleDateString("en-US", options);
}

function updateForecast(data) {
  const forecast = document.getElementById("week");
  const tzOffset = data.city.timezone;

  // Group the 3-hour entries by local calendar day, then show each day's high and low.
  const days = new Map();
  data.list.forEach((element) => {
    const local = new Date((element.dt + tzOffset) * 1000);
    const key = local.toISOString().slice(0, 10);
    const hour = local.getUTCHours();
    const day = days.get(key) || { dt: element.dt, high: -Infinity, low: Infinity, icon: null, iconDistance: Infinity };
    day.high = Math.max(day.high, element.main.temp_max);
    day.low = Math.min(day.low, element.main.temp_min);
    // Use the icon closest to midday as the day's icon.
    const distance = Math.abs(hour - 12);
    if (distance < day.iconDistance) {
      day.icon = element.weather[0].icon;
      day.iconDistance = distance;
    }
    days.set(key, day);
  });

  forecast.innerHTML = [...days.values()].slice(0, 5).map((day) => `
      <div class="weekElem">
        <h2>${convertDay(day.dt, tzOffset)}</h2>
        <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="">
        <h4>${Math.round(day.high)}° / ${Math.round(day.low)}°F</h4>
      </div>
    `).join("");
}

// Formats a unix timestamp in the city's local time (tzOffset is seconds from UTC).
function convertTime(dt, tzOffset = 0) {
  const date = new Date((dt + tzOffset) * 1000);

  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  const suffix = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes} ${suffix}`;
}

function convertDay(dt, tzOffset = 0) {
  const date = new Date((dt + tzOffset) * 1000);
  return date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
}

function convertTimezone(timezoneOffset) {
  const sign = timezoneOffset < 0 ? "-" : "+";
  const totalMinutes = Math.abs(timezoneOffset) / 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `UTC${sign}${hours}${minutes ? ":" + String(minutes).padStart(2, "0") : ""}`;
}

function degreesToCompass(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

function getWeatherObj(weatherType) {
  const obj = {
    className: "",
    video: "",
  };

  // OpenWeatherMap "main" values: https://openweathermap.org/weather-conditions
  switch (weatherType) {
    case "Clear":
      obj.className = "weather-sunny";
      obj.video = "./weathervids/clearsky.mp4";
      break;
    case "Clouds":
      obj.className = "weather-cloudy";
      obj.video = "./weathervids/cloudy.mp4";
      break;
    case "Rain":
      obj.className = "weather-rainy";
      obj.video = "./weathervids/rainy.mp4";
      break;
    case "Drizzle":
      obj.className = "weather-drizzle";
      obj.video = "./weathervids/drizzle.mp4";
      break;
    case "Mist":
      obj.className = "weather-mist";
      obj.video = "./weathervids/haze.mp4";
      break;
    case "Smoke":
      obj.className = "weather-smoke";
      obj.video = "./weathervids/smoke.mp4";
      break;
    case "Haze":
      obj.className = "weather-hazy";
      obj.video = "./weathervids/haze.mp4";
      break;
    case "Dust":
    case "Sand":
      obj.className = "weather-dust";
      obj.video = "./weathervids/Dust.mp4";
      break;
    case "Fog":
      obj.className = "weather-fog";
      obj.video = "./weathervids/fog.mp4";
      break;
    case "Ash":
      obj.className = "weather-ash";
      obj.video = "./weathervids/haze.mp4";
      break;
    case "Squall":
    case "Tornado":
      obj.className = "weather-tornado";
      obj.video = "./weathervids/tornado.mp4";
      break;
    case "Snow":
      obj.className = "weather-snowy";
      obj.video = "./weathervids/snow.mp4";
      break;
    case "Thunderstorm":
      obj.className = "weather-thunderstorm";
      obj.video = "./weathervids/thunderstrom.mp4";
      break;
    default:
      console.log("weatherType not found, no background provided");
  }
  return obj;
}

// Load the last searched city so the page isn't empty on return visits.
(function loadLastCity() {
  let lastCity = null;
  try {
    lastCity = localStorage.getItem("lastCity");
  } catch (e) {
    // Ignore unavailable storage.
  }
  if (lastCity) {
    document.getElementById("search-bar").value = lastCity;
    search();
  }
})();
