//----------Dark Mode Switch----------
const darkModeSwitch = document.getElementById('darkModeSwitch');

if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
    darkModeSwitch.checked = true;
}

darkModeSwitch.addEventListener('change', () => {
    if (darkModeSwitch.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.querySelector('.sidebar').classList.add('dark-mode');
    document.querySelector('.main-content').classList.add('dark-mode');
    document.getElementById('hourly-forecast').classList.add('dark-mode'); // Add this line
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.querySelector('.sidebar').classList.remove('dark-mode');
    document.querySelector('.main-content').classList.remove('dark-mode');
    document.getElementById('hourly-forecast').classList.remove('dark-mode'); // Add this line
    localStorage.setItem('darkMode', 'disabled');
}

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
    // aboutSection.style.display = 'none';
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
    weeklyForecastDiv.style.display = 'flex';
    weeklyForecastDiv.style.overflowX = 'auto';
    weeklyForecastDiv.style.scrollSnapType = 'x mandatory';
    weeklyForecastDiv.style.padding = '10px';
    weeklyForecastDiv.style.gap = '10px';
    weeklyForecastDiv.style.whiteSpace = 'nowrap';
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
    fetchWeatherData("Colombo");
}

init();


// Cities Page

const countrySearch = document.getElementById('country-search');
const countryList = document.getElementById('country-list');
const countryDetails = document.getElementById('country-details');
const countryFlag = document.getElementById('country-flag');
const countryName = document.getElementById('country-name');
const countryCapital = document.getElementById('country-capital');
const countryRegion = document.getElementById('country-region');
const countrySubregion = document.getElementById('country-subregion');
const countryPopulation = document.getElementById('country-population');
const countryLanguages = document.getElementById('country-languages');
const countryCurrencies = document.getElementById('country-currencies');

let countries = [];

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json();
        console.log(response);
        displayCountries(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function displayCountries(countries) {
    countryList.innerHTML = '';
    countries.forEach(country => {
        const countryItem = document.createElement('div');
        countryItem.className = 'country-item';
        countryItem.textContent = country.name.common;
        countryItem.addEventListener('click', () => showCountryDetails(country));
        countryList.appendChild(countryItem);
    });
}

function showCountryDetails(country) {
    countryFlag.src = country.flags.svg;
    countryFlag.alt = `Flag of ${country.name.common}`;
    countryName.textContent = country.name.common;
    countryCapital.textContent = country.capital ? country.capital[0] : 'N/A';
    countryRegion.textContent = country.region;
    countrySubregion.textContent = country.subregion;
    countryPopulation.textContent = country.population.toLocaleString();
    countryLanguages.textContent = Object.values(country.languages).join(', ');
    countryCurrencies.textContent = Object.values(country.currencies).map(currency => `${currency.name} (${currency.symbol})`).join(', ');
    countryDetails.style.display = 'block';
}

countrySearch.addEventListener('input', function () {
    const searchTerm = countrySearch.value.toLowerCase();
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(searchTerm));
    displayCountries(filteredCountries);
});

fetchCountries();

//Map Page
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('A marker on London.')
    .openPopup();