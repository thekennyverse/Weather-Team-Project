async function search() {
  var inputText = document.getElementById("search-bar").value;
  console.log(inputText);

  await updateWeather(inputText);
  await updateForecast(inputText);
}
/**

*/
async function fetchWeatherData(city) {
  const apiKey = "dab3d1327e88d079912bdd2ae64e52b5";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  const response = await fetch(url);

  const data = await response.json();
  console.log(data);
  return data;
}

/* This function is fetching forecast weather data for a given city using the OpenWeatherMap API. It
takes in a city parameter, constructs a URL with the city and API key, and then uses the `fetch()`
method to make a GET request to the API. It then waits for the response to come back using the
`await` keyword, and then parses the response data into JSON format using the `response.json()`
method. Finally, it returns the parsed data. */
async function fetchForecastData(city) {
  const apiKey = "dab3d1327e88d079912bdd2ae64e52b5";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&cnt=56&appid=${apiKey}`;
  const response = await fetch(url);

  const data = await response.json();
  return data;
}

async function updateWeather(inputText) {
  const data = await fetchWeatherData(inputText);
  console.log(data);
  const cityName = data.name;
  const weatherType = data.weather[0].main;
  const obj = getWeatherObj(weatherType);

  const weather_dashboard = document.getElementById("weather_dashboard");
  weather_dashboard.innerHTML = `
      <h2 class="city">${cityName}</h2>
      <h3 class="time">As of ${convertTime(data.dt)}</h3>
      <h1 class="temp">${data.main.temp} °F</h1>
      <p class="high">91 °F</p>
      <p class="low">62 °F</p>

      <div class="flex">
          <img src=${obj.icon} alt="" class="icon" />
          <div class="description">${weatherType}</div>
      </div>

      <div class="pressure">Pressure: 29.76 in</div>
      <div class="humidity">Humidity: 91%</div>
  `;
  const dateElement = document.querySelector('.date');
  dateElement.innerText = getCurrentDate();

  const weathernow = await fetchForecastData(inputText);
  console.log(weathernow);
  const sunrise = document.getElementById("sunrise");
  const sunset = document.getElementById("sunset");
  const windSpeed = document.getElementById("wind-speed");
  const windDirection = document.getElementById("wind-direction");
  const visibility = document.getElementById("vis");
  const timezone = document.getElementById('tz');
  const videoElement = document.getElementById("video_");
  const sourceElement = document.getElementById("source_");
  

  const sunSetTime = convertTime(weathernow.city.sunset);
  const sunRiseTime = convertTime(weathernow.city.sunrise);

  sunrise.innerText = `sunrise ${sunRiseTime}`;
  sunset.innerText = `sunset ${sunSetTime}`;

  windSpeed.innerHTML = `Wind Speed ${data.wind.speed} mph`;
  windDirection.innerHTML = `Wind Direction ${data.wind.deg} °`;

  visibility.innerHTML = `Visibilty: Clear up to ${data.visibility / 1000} km`
  timezone.innerHTML = `Time Zone: UTC-${convertTimezone(data.timezone)}`

  console.log("obj",obj);
 
/* These lines of code are setting the source of a video element to the URL of a video file based on
the weather type, loading the video, and playing it. This is used to display a background video that
corresponds to the current weather conditions. */

  sourceElement.setAttribute("src", obj.video);
  videoElement.load();
  videoElement.play();


}
// New function to get the current date and time
function getCurrentDate() {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return currentDate.toLocaleDateString('en-US', options);
}


async function updateForecast(inputText) {
  const forecast = document.getElementById("week");
  const data = await fetchForecastData(inputText);

  const forecastList = data.list.reduce((acc, element, index) => {
    if (index % 8 === 0) {
      const day = convertDay(element.dt);
      const temp = element.main.temp.toPrecision(2);
      const icon = `https://openweathermap.org/img/wn/${element.weather[0].icon}.png`;
      const elementHtml = `
      <div class="weekElem">
        <h2>${day}</h2>
        <img src=${icon}>
        <h4>${temp}°F</h4>
      </div>
    `;
      return acc + elementHtml;
    }
    return acc;
  }, "");
  forecast.innerHTML = forecastList;
}

function convertTime(dt) {
  let milliseconds = dt * 1000;
  const date = new Date(milliseconds);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let suffix = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  let strTime = hours + ":" + minutes + " " + suffix;

  return strTime;
}

function convertDay(dt) {
  let milliseconds = dt * 1000;
  const date = new Date(milliseconds);

  let dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

  return dayOfWeek;
}


function convertTimezone(timezoneOffset) {
  var hours = Math.abs(timezoneOffset) / 3600;
  return hours;
}

function getWeatherObj(weatherType) {
  let obj = {
    classname: "",
    icon: "",
  };

  switch (weatherType) {
    case "Clear":
      obj.className = "weather-sunny";
      obj.icon = "https://openweathermap.org/img/wn/01d.png";
      obj.video = "./weathervids/clearsky.mp4";
      break;
    case "Partly Sunny": // falls under the description: few clouds
      obj.className = "weather-partly-sunny";
      obj.icon = "https://openweathermap.org/img/wn/02d.png";
      obj.video = "./weathervids/partlysunny.mp4";
    case "Clouds":
      obj.className = "weather-cloudy";
      obj.icon = "https://openweathermap.org/img/wn/04n.png";
      obj.video = "./weathervids/cloudy.mp4";
      break;
    case "Rain": // light, moderate, heavy intensity, very heavy, & extreme rain
      obj.className = "weather-rainy";
      obj.icon = "https://openweathermap.org/img/wn/10d.png";
      obj.video = "./weathervids/rainy.mp4";
      break;
    case "Freezing Rain": // this might be the same thing as Sleet
      obj.className = "weather-freezing-rain";
      obj.icon = "https://openweathermap.org/img/wn/13d.png";
      obj.video = "./weathervidsfreezerain.mp4";
    case "Shower Rain": //light & heavy intensity, ragged, shower rain
      obj.className = "weather-shower-rain";
      obj.icon = "https://openweathermap.org/img/wn/09d.png";
      obj.video = "./weathervids/rainy.mp4";
    case "Drizzle":
      obj.className = "weather-drizzle";
      obj.icon = "https://openweathermap.org/img/wn/09d.png";
      obj.video = "./weathervids/drizzle.mp4";
      break;
    case "Mist":
      obj.className = "weather-mist";
      obj.icon = "https://openweathermap.org/img/wn/50d.png";
      obj.video = "./weathervids/haze.mp4";
      break;
    case "Smoke":
      obj.className = "weather-smoke";
      obj.icon = "https://openweathermap.org/img/wn/50d.png";
      obj.video = "./weathervids/smoke.mp4";
      break;
    case "Haze":
      obj.className = "weather-hazy";
      obj.icon = "https://openweathermap.org/img/wn/50d.png";
      obj.video = "./weathervids/haze.mp4";
      break;
    case "Dust":
      obj.className = "weather-dust";
      obj.icon = "https://openweathermap.org/img/wn/50d.png";
      obj.video = "./weathervids/Dust.mp4";
      break;
    case "Fog":
      obj.className = "weather-fog";
      obj.icon = "https://openweathermap.org/img/wn/50d.png";
      obj.video = "./weathervids/fog.mp4";
      break;
    case "Sand":
      obj.className = "weather-sand";
      obj.icon = "https://openweathermap.org/img/wn/50d.png";
      obj.video = "./weathervids/Dust.mp4";
      break;
    case "Ash":
      obj.className = "weather-Ash";
      obj.icon = "https://openweathermap.org/img/wn/50d.png";
      obj.video = "./weathervids/haze.mp4";
      break;
    case "Tornado":
      obj.className = "weather-Tornado";
      obj.icon = "https://openweathermap.org/img/wn/50d.png";
      obj.video = "./weathervids/tornado.mp4";
      break;
    case "Snow":
      obj.className = "weather-snowy";
      obj.icon = "https://openweathermap.org/img/wn/13d.png";
      obj.video = "./weathervids/snow.mp4";
      break;
    case "Thunderstorm":
      obj.className = "weather-thunderstorm";
      obj.icon = "https://openweathermap.org/img/wn/11d.png";
      obj.video = "./weathervids/thunderstorm.mp4";
      break;
    default:
      console.log("weatherType not found, no background provided");
  }
  return obj;
}
