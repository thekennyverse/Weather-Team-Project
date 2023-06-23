async function search(){
    var inputText = document.getElementById('search-bar').value;
    console.log(inputText)
    // updateWeather(inputText);
    // updateSun(inputText);
    await updateForecast(inputText);
}
/**
 * The function fetches weather data for a given city using the OpenWeatherMap API.
 * @param city - The name of the city for which you want to fetch weather data.
 * @returns The function `fetchWeatherData` returns a Promise that resolves to the weather data for the
 * specified city in JSON format.
 */
async function fetchWeatherData(city) {
    const apiKey = 'dab3d1327e88d079912bdd2ae64e52b5';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const response = await fetch(url);
/* `const data = await response.json();` is converting the response from the OpenWeatherMap API into
JSON format and assigning it to the `data` variable. This allows us to easily access and manipulate
the data in our JavaScript code. */
    const data = await response.json();
    return data
}


/**
 * The function fetches weather data for a given city using the OpenWeatherMap API.
 * @param city - The name of the city for which you want to fetch weather data.
 * @returns The function `fetchWeatherData` returns a Promise that resolves to the weather data for the
 * specified city in JSON format.
 */
async function fetchForecastData(city) {
  const apiKey = 'dab3d1327e88d079912bdd2ae64e52b5';
  const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&cnt=3&appid=${apiKey}`;
  const response = await fetch(url);
/* `const data = await response.json();` is converting the response from the OpenWeatherMap API into
JSON format and assigning it to the `data` variable. This allows us to easily access and manipulate
the data in our JavaScript code. */
  const data = await response.json();
  return data
}



/**
 * The function updates the weather dashboard with data fetched from an API based on the input text.
 * @param inputText - The inputText parameter is a string that represents the city name or zip code
 * entered by the user to get the weather information.
 */
async function updateWeather(inputText) {
    const data = await fetchWeatherData(inputText);
    console.log(data);
    const cityName = data.name;
    const weatherType = data.weather[0].main;
    const obj = getWeatherObj(weatherType);


    const weather_dashboard = document.getElementById('weather_dashboard')
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
}


async function updateForecast(inputText){

  const forecast = document.getElementById('week');
  const data = await fetchForecastData(inputText);


  console.log(data.list.length)

  const forecastList = data.list.map((element) => {
    const day = convertDay(element.dt);
    const temp = element.main.temp.toPrecision(2);
    const icon = `https://openweathermap.org/img/wn/${element.weather[0].icon}.png`;
    return { day, temp, icon };

  }).filter((obj, index, self) => {
    // Use a temporary Set to keep track of unique values
    const values = new Set(self.map((item) => item.day));
    
    // Filter out objects with duplicate "day" values
    return values.has(obj.day);
  }).map((element) => {
      return`
      <div class="weekElem">
        <h2>${element.day}</h2>
        <img src=${element.icon}>
        <h4>${element.temp}°F</h4>
      </div>
      `
  }).join("");




  console.log(forecastList);
  
  forecast.innerHTML = forecastList

}


async function updateSun(inputText){

}


function convertTime(dt){
    let milliseconds = dt * 1000;
    const date = new Date(milliseconds);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let suffix = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    let strTime = hours + ':' + minutes + ' ' + suffix;

    return strTime;
}


function convertDay(dt) {
  let milliseconds = dt * 1000;
  const date = new Date(milliseconds);

  let dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

  return dayOfWeek;
}

function getWeatherObj(weatherType) {
    let obj = {
        classname: "",
        icon: ""
    }

    /* The `switch` statement is checking the value of the `weatherType` variable and based on its
    value, it is assigning a corresponding CSS class to the `obj.className` property. This is used
    to dynamically change the background image of the weather dashboard based on the weather type.
    For example, if the `weatherType` is "Clear", the `obj.className` is set to "weather-sunny",
    which will change the background image to a sunny day. Similarly, if the `weatherType` is
    "Clouds", the `obj.className` is set to "weather-cloudy", which will change the background image
    to a cloudy day. */
    switch (weatherType) {
      case "Clear":
        obj.className = "weather-sunny";
        obj.icon = "https://openweathermap.org/img/wn/01d.png"
        break;
      case "Partly Sunny": // falls under the description: few clouds
        obj.className = "weather-partly-sunny";
        obj.icon = "https://openweathermap.org/img/wn/02d.png"
      case "Clouds":
        obj.className = "weather-cloudy";
        obj.icon = "https://openweathermap.org/img/wn/04n.png"
        break;
      case "Rain": // light, moderate, heavy intensity, very heavy, & extreme rain
        obj.className = "weather-rainy";
        obj.icon = "https://openweathermap.org/img/wn/10d.png"
        break;
      case "Freezing Rain": // this might be the same thing as Sleet
        obj.className = "weather-freezing-rain";
        obj.icon = "https://openweathermap.org/img/wn/13d.png"
      case "Shower Rain": //light & heavy intensity, ragged, shower rain
        obj.className = "weather-shower-rain";
        obj.icon = "https://openweathermap.org/img/wn/09d.png"
      case "Drizzle":
        obj.className = "weather-drizzle";
        obj.icon = "https://openweathermap.org/img/wn/09d.png"
        break;
      case "Mist":
        obj.className = "weather-mist";
        obj.icon = "https://openweathermap.org/img/wn/50d.png"
        break;
      case "Smoke":
        obj.className = "weather-smoke";
        obj.icon = "https://openweathermap.org/img/wn/50d.png"
        break;
      case "Haze":
        obj.className = "weather-hazy";
        obj.icon = "https://openweathermap.org/img/wn/50d.png"
        break;
      case "Dust":
        obj.className = "weather-dust";
        obj.icon = "https://openweathermap.org/img/wn/50d.png"
        break;
      case "Fog":
        obj.className = "weather-fog";
        obj.icon = "https://openweathermap.org/img/wn/50d.png"
        break;
      case "Sand":
        obj.className = "weather-sand";
        obj.icon = "https://openweathermap.org/img/wn/50d.png"
        break;
      case "Ash":
        obj.className = "weather-Ash";
        obj.icon = "https://openweathermap.org/img/wn/50d.png"
        break;
      case "Tornado":
        obj.className = "weather-Tornado";
        obj.icon = "https://openweathermap.org/img/wn/50d.png"
        break;
      case "Snow":
        obj.className = "weather-snowy";
        obj.icon = "https://openweathermap.org/img/wn/13d.png"
        break;
      case "Thunderstorm":
        obj.className = "weather-thunderstorm";
        obj.icon = "https://openweathermap.org/img/wn/11d.png"
        break;
      default:
        console.log("weatherType not found, no background provided");
    }
    return obj;
  }
  

