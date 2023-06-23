async function search(){
  var inputText = document.getElementById('search-bar').value;
  console.log(inputText)
 
  await updateWeather(inputText);
  await updateForecast(inputText);
}
/**

*/
async function fetchWeatherData(city) {
  const apiKey = 'dab3d1327e88d079912bdd2ae64e52b5';
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  const response = await fetch(url);

  const data = await response.json(); 
  console.log(data)
  return data
}



async function fetchForecastData(city) {
const apiKey = 'dab3d1327e88d079912bdd2ae64e52b5';
const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&cnt=56&appid=${apiKey}`;
const response = await fetch(url);

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
  const weathernow = await fetchForecastData(inputText);
  console.log(weathernow)
  const sunrise = document.getElementById("sunrise")
  const sunset = document.getElementById("sunset")
  let sunrisetime = new Date(weathernow.city.sunrise * 1000)
  let hours = sunrisetime.getHours()
  let minutes ="0" + sunrisetime.getMinutes()
  const time = hours + ":" + minutes.substr(-2)

  sunrise.innerText = `sunrise ${time}am`
}


async function updateForecast(inputText){

const forecast = document.getElementById('week');
const data = await fetchForecastData(inputText);


console.log(data)


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


