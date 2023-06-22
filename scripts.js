function search(){
    var inputText = document.getElementById('search-bar').value;
    console.log(inputText)
    updateWeather(inputText);
    updateSun(inputText);

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

function getWeatherObj(weatherType) {
    let obj = {
        classname: "",
        icon: ""
    }

    switch (weatherType) {
      case "Clear":
        obj.className = "weather-sunny";
        break;
      case "Clouds":
        obj.className = "weather-cloudy";
        obj.icon = "https://openweathermap.org/img/wn/04n.png"
        break;
      case "Rain":
        obj.className = "weather-rainy";
        break;
      case "Drizzle":
        obj.className = "weather-drizzle";
        break;
      case "Mist":
        obj.className = "weather-mist";
        break;
      case "Smoke":
        obj.className = "weather-smoke";
        break;
      case "Haze":
        obj.className = "weather-hazy";
        break;
      case "Dust":
        obj.className = "weather-dust";
        break;
      case "Fog":
        obj.className = "weather-fog";
        break;
      case "Sand":
        obj.className = "weather-sand";
        break;
      case "Ash":
        obj.className = "weather-Ash";
        break;
      case "Tornado":
        obj.className = "weather-Tornado";
        break;
      case "Snow":
        obj.className = "weather-snowy";
        break;
      case "Thunderstorm":
        obj.className = "weather-thunderstorm";
        break;
      default:
        console.log("weatherType not found, no background provided");
    }
    return obj;
  }
  

