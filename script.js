//----------Buttons On Click Events----------
const btnWeather = document.getElementById('weather-btn');
const btnCities = document.getElementById('city-btn');
const btnMap = document.getElementById('map-btn');
const btnSettings = document.getElementById('settings-btn');
const btnAbout = document.getElementById('about-btn');

const weatherSection = document.getElementById('weather-section');
const countryInfoSection = document.getElementById('country-info-section');
const mapSection = document.getElementById('map-section');
const settingsSection = document.getElementById('settings-section');
const aboutSection = document.getElementById('about-section');

// Button Event Listeners
btnWeather.addEventListener('click', () => {
    weatherSection.style.display = 'block';
    countryInfoSection.style.display = 'none';
    settingsSection.style.display = 'none';
    aboutSection.style.display = 'none';
    mapSection.style.display = 'none';
});

btnCities.addEventListener('click', () => {
    weatherSection.style.display = 'none';
    countryInfoSection.style.display = 'block';
    settingsSection.style.display = 'none';
    aboutSection.style.display = 'none';
    mapSection.style.display = 'none';
});

btnMap.addEventListener('click', () => {
    weatherSection.style.display = 'none';
    countryInfoSection.style.display = 'none';
    settingsSection.style.display = 'none';
    aboutSection.style.display = 'none';
    mapSection.style.display = 'block';
});

btnSettings.addEventListener('click', () => {
    weatherSection.style.display = 'none';
    countryInfoSection.style.display = 'none';
    settingsSection.style.display = 'block';
    aboutSection.style.display = 'none';
    mapSection.style.display = 'none';
});

btnAbout.addEventListener('click', () => {
    weatherSection.style.display = 'none';
    countryInfoSection.style.display = 'none';
    settingsSection.style.display = 'none';
    aboutSection.style.display = 'block';
    mapSection.style.display = 'none';
});

//----------Weather Details From API----------
const apiKey = "ce3c0280e09f4f4dac2141825240809";
const apiBaseUrl = "https://api.weatherapi.com/v1";

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`${apiBaseUrl}/forecast.json?key=${apiKey}&q=${city}&days=7`);
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Please check the city name and try again.");
    }
}

function updateWeatherUI(data) {
    document.getElementById("location-name").textContent = data.location.name;
    document.getElementById("chance-of-rain").textContent = `Chance of rain: ${data.current.precip_mm}%`;
    document.getElementById("temperature").textContent = `${data.current.temp_c}°`;
    document.getElementById("real-feel").textContent = `${data.current.feelslike_c}°`;
    document.getElementById("wind-speed").textContent = `${data.current.wind_kph} km/h`;
    document.getElementById("uv-index").textContent = data.current.uv;
    document.getElementById("weather-icon").src = `https:${data.current.condition.icon}`;
    document.getElementById("weather-icon").alt = data.current.condition.text;

    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    hourlyForecastDiv.innerHTML = "";
    data.forecast.forecastday[0].hour.forEach(hour => {
        const hourDiv = document.createElement("div");
        hourDiv.classList.add("hour-card");
        hourDiv.innerHTML = `
            <p>${new Date(hour.time).getHours()}:00</p>
            <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
            <p>${hour.temp_c}°</p>
        `;
        hourlyForecastDiv.appendChild(hourDiv);
    });

    const weeklyForecastDiv = document.getElementById("weekly-forecast");
    weeklyForecastDiv.innerHTML = "";
    data.forecast.forecastday.forEach(day => {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day-card");
        dayDiv.innerHTML = `
            <p>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>Max: ${day.day.maxtemp_c}° Min: ${day.day.mintemp_c}°</p>
        `;
        weeklyForecastDiv.appendChild(dayDiv);
    });    
}

function handleCitySearch() {
    const cityInput = document.getElementById("city-input");
    cityInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            const city = cityInput.value;
            fetchWeatherData(city);
        }
    });
    
    const citySearchBtn = document.getElementById("city-search-btn");
    citySearchBtn.addEventListener('click', () => {
        const city = cityInput.value;
        fetchWeatherData(city);
    });
}

function init() {
    handleCitySearch();
    fetchWeatherData("Colombo");

    weatherSection.style.display = 'block';
    countryInfoSection.style.display = 'none';
    mapSection.style.display = 'none';
    settingsSection.style.display = 'none';
    aboutSection.style.display = 'none';
}

init();
