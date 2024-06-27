const APIKey = "25f428c7c11fb54c19acdbb90228ec07";
const searchInput = document.querySelector("#city");
const mainWeatherDiv = document.querySelector("#main-weather-details");
const forecastCardsDiv = document.querySelector("#forecast-cards");
const form = document.querySelector("#weather-form");
const historyButtons = document.querySelector("#search-history");


let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function getMainWeather(city) {
    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    const cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

    fetch(cityURL)
        .then(response => response.json())
        .then(data => {
            printMainWeather(data);
            saveToSearchHistory(city);
            getForecastWeather(data.coord.lat, data.coord.lon);
        });
}

function printMainWeather(weatherData) {
    mainWeatherDiv.innerHTML = `
        <h2>${weatherData.name}</h2>
        <h4>Temperature: ${weatherData.main.temp}°C</h4>
        <h4>Wind: ${weatherData.wind.speed} km/h</h4>
        <h4>Humidity: ${weatherData.main.humidity}%</h4>
        <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="weather-icon">`;
}

function getForecastWeather(lat, lon) {
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;

    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            forecastCardsDiv.innerHTML = '';
            data.list.filter(forecast => forecast.dt_txt.includes("15:00:00"))
                .slice(0, 5)
                .forEach(forecast => {
                    forecastCardsDiv.innerHTML += `
                        <div class="forecast-card">
                            <h3>${new Date(forecast.dt_txt).toLocaleDateString()}</h3>
                            <p>Temperature: ${forecast.main.temp}°C</p>
                            <p>Wind: ${forecast.wind.speed} km/h</p>
                            <p>Humidity: ${forecast.main.humidity}%</p>
                            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="weather-icon">
                        </div>`;
                });
        });
}

function saveToSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        pushSearchHistory();
    }
}

function pushSearchHistory() {
    historyButtons.innerHTML = '';
    searchHistory.forEach(city => {
        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.classList.add('btn', 'btn-secondary', 'btn-block');
        cityButton.onclick = () => getMainWeather(city);
        historyButtons.appendChild(cityButton);
    });
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = searchInput.value;
    getMainWeather(city);
});

document.addEventListener('DOMContentLoaded', function() {
    pushSearchHistory(); 
});
