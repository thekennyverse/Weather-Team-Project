

function search(){
    var inputText = document.getElementById('city-input').value;
    populateDashboard(inputText);
}


async function fetchWeatherData(city) {
    const apiKey = 'dab3d1327e88d079912bdd2ae64e52b5';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data
}

async function populateDashboard(inputText){
    const data = await fetchWeatherData(inputText);
    console.log(data);
    const cityName = data.name;
    const weatherType = data.weather[0].main;
    const className = getClassName(weatherType);

    const backgroundDiv = document.getElementById("background_picture");
    backgroundDiv.className = className;

    const cityNameDiv = document.getElementById("city-name");
    cityNameDiv.innerHTML = cityName;

}


function getClassName(weatherType){
    let className = "";
    switch(weatherType){
        case "Clear":
            className = "weather-sunny";
            break;
        case "Clouds":
            className = "weather-cloudy";
            break;
        case "Rain":
            className = "weather-rainy";
            break;
            case "Drizzle":
            className = "weather-drizzle";
            break;
            case "Mist":
            className = "weather-mist";
            break;
            case "Smoke":
            className = "weather-smoke";
            break;
            case "Haze":
            className = "weather-hazy";
            break;
            case "Dust":
            className = "weather-dust";
            break;
            case "Fog":
            className = "weather-fog";
            break;
            case "Sand":
            className = "weather-sand";
            break;
            case "Ash":
            className = "weather-Ash";
            break;
            case "Tornado":
            className = "weather-Tornado";
            break;
            case "Snow":
            className = "weather-snowy";
            break;
            case "Thunderstorm":
            className = "weather-thunderstorm";
            break;

        default: 
            console.log("weatherType not found, no background provided");
    }
    return className;
}