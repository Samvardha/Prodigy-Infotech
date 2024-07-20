// Event handler for the search button click
document.getElementById('searchBtn').addEventListener('click', async () => {
    console.log('Search button clicked');
    searchWeather();
    removeSearchBarInput();
    fadeInContent();
});

// Event handler for the Enter key press in the search input
const searchInput = document.querySelector('.search input');
searchInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        console.log('Enter key pressed');
        searchWeather();
        searchInput.blur();
        removeSearchBarInput()
    }
});

// Capitalize the first letter of the input value
searchInput.addEventListener('input', () => {
    const value = searchInput.value;
    searchInput.value = value.charAt(0).toUpperCase() + value.slice(1);
    console.log('Input value capitalized:', searchInput.value);
});

// Search for weather data based on location
async function searchWeather() {
    resetTimeButtonText()
    resetTemperatureButton();
    const location = searchInput.value;
    console.log('Searching weather for location:', location);
    if (location) {
        try {
            const weatherData = await fetchWeatherData(location);
            console.log('Weather data fetched:', weatherData);
            if (weatherData.cod === 200) {
                updateCurrentWeather(weatherData);
                const forecastData = await fetchForecastData(location);
                console.log('Forecast data fetched:', forecastData);
                updateForecast(forecastData);
                // Smooth scroll to the top of the forecast container
                smoothScrollToTop(document.querySelector('#forecast-data .info'));
            } else {
                alert('Location not found!');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data!');
        }
    } else {
        alert('Please enter a location!');
    }
}

// Function for smooth scrolling to the top of an element
function smoothScrollToTop(element) {
    const duration = 500;
    const startPosition = element.scrollTop;
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
        const elapsedTime = currentTime - startTime;
        const ease = easeInOut(elapsedTime, startPosition, -startPosition, duration);
        element.scrollTop = ease;
        if (elapsedTime < duration) {
            requestAnimationFrame(scrollAnimation);
        }
    }

    function easeInOut(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(scrollAnimation);
}

// Fetch current weather data from the API
async function fetchWeatherData(location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    return data;
}

// Fetch forecast data from the API
async function fetchForecastData(location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    return data;
}

// Ask for permission to access user's location
function askForLocationPermission() {
    return new Promise((resolve, reject) => {
        const confirmation = confirm("This website wants to use your current location. Allow?");
        if (confirmation) {
            resolve();
        } else {
            reject(new Error('Location permission denied'));
        }
    });
}

// Fetch weather data based on user's current location
async function fetchWeatherDataByLocation() {
    try {
        await askForLocationPermission();
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('User location:', latitude, longitude);
            const weatherData = await fetchWeatherDataByCoords(latitude, longitude);
            const forecastData = await fetchForecastDataByCoords(latitude, longitude);
            updateCurrentWeather(weatherData);
            updateForecast(forecastData);
            updateCurrentLocation(weatherData);
        });
    } catch (error) {
        console.error('Error fetching weather data by location:', error);
        updateCurrentLocation(null, true);
    }
}

// Fetch weather data by coordinates
async function fetchWeatherDataByCoords(latitude, longitude) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    return data;
}

// Fetch forecast data by coordinates
async function fetchForecastDataByCoords(latitude, longitude) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    return data;
}

// Update current location in the DOM
function updateCurrentLocation(data, error = false) {
    const currentLocElement = document.querySelector('.currentLoc');
    if (error) {
        currentLocElement.textContent = "Enable Location";
    } else {
        currentLocElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
            </svg> ${data.name}, ${data.sys.country}`;
    }
}

// Call fetchWeatherDataByLocation() when the page loads
window.addEventListener('load', fetchWeatherDataByLocation);
window.addEventListener('load', function() {
    document.body.style.display = 'none';
    document.body.offsetHeight;
    document.body.style.display = '';
});
// Capitalize the first letter of each word
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Update the current weather data on the page
function updateCurrentWeather(data) {
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weatherIcon').style.display = 'block';
    document.getElementById('weatherStat-text').textContent = capitalizeWords(data.weather[0].description);
    document.getElementById('tempFeel').innerHTML = `Feels Like: <span id="tempFeelValue">${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById('tempMax').innerHTML = `Max. Temperature: <span id="tempMaxValue">${Math.round(data.main.temp_max)}°C</span>`;
    document.getElementById('tempMin').innerHTML = `Min. Temperature: <span id="tempMinValue">${Math.round(data.main.temp_min)}°C</span>`;
    document.getElementById('sunrise').innerHTML = `Sunrise: <span id="sunriseTime"> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
    document.getElementById('sunset').innerHTML = `Sunset: <span id="sunsetTime"> ${new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
}

// Update the forecast data on the page
function updateForecast(data) {
    const forecastContainer = document.querySelector('#forecast-data .info');
    forecastContainer.innerHTML = ''; // Clear previous forecast data

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let dayCounter = 0;
    let currentDay = (new Date().getDay() + 1) % 7; // Start from the next day
    let dayData = [];

    // Collect data for the next 5 days
    data.list.forEach((forecast) => {
        const forecastDate = new Date(forecast.dt * 1000);
        const forecastDay = forecastDate.getDay();

        if (forecastDay === new Date().getDay()) return; // Skip the rest of the current day

        if (!dayData[forecastDay]) {
            dayData[forecastDay] = [];
        }
        dayData[forecastDay].push(forecast);
    });

    // Loop through the next 5 days
    while (dayCounter < 5) {
        const forecastDayData = dayData[currentDay];
        if (forecastDayData) {
            const dayContainer = document.createElement('div');
            dayContainer.className = 'container';

            const daySpan = document.createElement('span');
            daySpan.className = 'day';
            daySpan.textContent = days[currentDay];
            dayContainer.appendChild(daySpan);

            const quadContainer = document.createElement('div');
            quadContainer.className = 'tertiary';

            // Divide the day into 4 parts and display data for each part
            for (let i = 0; i < 4; i++) {
                const index = Math.floor(i * forecastDayData.length / 4);
                const quadData = forecastDayData[index];

                const quad = document.createElement('div');
                quad.className = 'quad';

                const forecastTime = document.createElement('span');
                forecastTime.classList.add('forecastTime');
                forecastTime.textContent = new Date(quadData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });                

                const forecastWeatherIcon = document.createElement('img');
                forecastWeatherIcon.classList.add('forecastWeatherIcon');
                forecastWeatherIcon.src = `http://openweathermap.org/img/wn/${quadData.weather[0].icon}@2x.png`;
                forecastWeatherIcon.style.display = 'block';

                const forecastTemp = document.createElement('span');
                forecastTemp.classList.add('forecastTemp');
                forecastTemp.textContent = `${Math.round(quadData.main.temp)}°C`;

                quad.appendChild(forecastTime);
                quad.appendChild(forecastWeatherIcon);
                quad.appendChild(forecastTemp);
                quadContainer.appendChild(quad);
            }

            dayContainer.appendChild(quadContainer);
            forecastContainer.appendChild(dayContainer);

            dayCounter++;
        }
        currentDay = (currentDay + 1) % 7;
    }
}

// API key
const apiKey = '93d8d705f6f5df75d9bb3f21d61da80e';

// Event handler for temperature change button
document.getElementById('tempChange').addEventListener('click', () => {
    const currentUnit = document.getElementById('tempChange').textContent; // Get the current unit
    const isCelsius = currentUnit === '°C';

    // Toggle temperature units for elements
    toggleTemperatureUnit('temp', isCelsius);
    toggleTemperatureUnit('tempMinValue', isCelsius);
    toggleTemperatureUnit('tempMaxValue', isCelsius);
    toggleTemperatureUnit('forecastTemp', isCelsius);
    toggleTemperatureUnit('tempFeelValue', isCelsius);

    // Change button text based on the unit
    document.getElementById('tempChange').textContent = isCelsius ? '°F' : '°C';
});

// Function to toggle temperature unit for a specific element
function toggleTemperatureUnit(identifier, isCelsius) {
    const elements = document.querySelectorAll(`#${identifier}, .${identifier}`);
    
    elements.forEach(element => {
        let temperature = parseFloat(element.textContent);

        if (isCelsius) {
            temperature = (temperature * 9 / 5) + 32;
            element.textContent = Math.round(temperature) + '°F';
        } else {
            temperature = (temperature - 32) * 5 / 9;
            element.textContent = Math.round(temperature) + '°C';
        }
    });
}

// Function to reset temperature button text to Celsius
function resetTemperatureButton() {
    document.getElementById('tempChange').textContent = '°C';
}

document.querySelector('.currentLoc').addEventListener('click', () => {
    fetchWeatherByCurrentLocation();
    removeSearchBarInput();
    resetTimeButtonText();
    fadeInContent();
});

// Function to remove the search bar input text
function removeSearchBarInput() {
    const searchInput = document.querySelector('.search input');
    searchInput.value = ''; // Clear the value of the input field
}

// Function to fetch weather data based on the text inside the current location element
async function fetchWeatherByCurrentLocation() {
    const currentLocText = document.querySelector('.currentLoc').textContent.trim();
    const location = currentLocText.split(',')[0]; // Extract the location name
    
    try {
        const weatherData = await fetchWeatherData(location);
        const forecastData = await fetchForecastData(location);
        
        const isCelsius = document.getElementById('tempChange').textContent === '°C';
        updateCurrentWeather(weatherData, isCelsius);
        updateForecast(forecastData, isCelsius);
        resetTemperatureButton();
        smoothScrollToTop(document.querySelector('#forecast-data .info'));
    } catch (error) {
        console.error('Error fetching weather data:', error);
        fetchWeatherDataByLocation();
    }
}

document.getElementById('timeChange').addEventListener('click', function() {
    const timeChangeButton = document.getElementById('timeChange');
    const currentTimeFormat = timeChangeButton.textContent;

    // Toggle between 12-hour and 24-hour formats
    const newTimeFormat = currentTimeFormat === '12 Hour' ? '24 Hour' : '12 Hour';
    timeChangeButton.textContent = newTimeFormat;

    // Update time formats for sunrise, sunset, and forecast elements
    updateTimeFormat('sunriseTime', newTimeFormat);
    updateTimeFormat('sunsetTime', newTimeFormat);
    updateTimeFormat('forecastTime', newTimeFormat);
});

// Function to update time format for elements
function updateTimeFormat(elementIdentifier, timeFormat) {
    const elements = document.querySelectorAll(`#${elementIdentifier}, .${elementIdentifier}`);
    elements.forEach(element => {
        const timeString = element.textContent.trim();
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':');
        let newTime;

        if (timeFormat === '12 Hour') {
            // Convert to 12-hour format
            let displayHours = parseInt(hours, 10);
            if (displayHours > 12) {
                displayHours -= 12;
                newTime = `${displayHours.toString().padStart(2, '0')}:${minutes} PM`;
            } else if (displayHours === 0) {
                newTime = `12:${minutes} AM`;
            } else if (displayHours === 12) {
                newTime = `12:${minutes} PM`;
            } else {
                newTime = `${displayHours.toString().padStart(2, '0')}:${minutes} AM`;
            }
        } else {
            // Convert to 24-hour format
            let displayHours = parseInt(hours, 10);
            if (period === 'PM') {
                displayHours += 12;
            }
            if (displayHours === 24) {
                displayHours = 0;
            }
            newTime = `${displayHours.toString().padStart(2, '0')}:${minutes}`;
        }

        element.textContent = newTime;
    });
}

function resetTimeButtonText() {
    document.getElementById('timeChange').textContent = '12 Hour';
}

// Function to update the date and time
function updateDateTime() {
    const dateTimeElement = document.querySelector('.date-time');
    const dayElement = dateTimeElement.querySelector('.currentDay');
    const dateElement = dateTimeElement.querySelector('.currentDate');
    const timeElement = dateTimeElement.querySelector('.currentTime');
    const now = new Date();

    // Format day
    const optionsDay = { weekday: 'long' };
    const dayString = now.toLocaleString(undefined, optionsDay);
    dayElement.textContent = dayString;

    // Format date
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleString(undefined, optionsDate);
    dateElement.textContent = dateString;

    // Format time
    const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    const timeString = now.toLocaleString(undefined, optionsTime);
    timeElement.textContent = timeString;
}

// Call the function initially
updateDateTime();

// Update the date and time every second
setInterval(updateDateTime, 1000);

function fadeIn(element) {
    element.classList.add('fade-in'); // Add fade-in class to trigger the animation
}

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.querySelector('.bar');
    const apiData = document.getElementById('api-data');
    const forecastData = document.getElementById('forecast-data');

    // Initially hide the API data and forecast data
    apiData.style.opacity = '0';
    forecastData.style.opacity = '0';

    // Add fade-in animation class to the search bar
    searchBar.classList.add('fade-in');

    // Add a delay before adding fade-in animation class to the data
    setTimeout(function() {
        // Call the fadeIn function for the API data
        apiData.style.opacity = '1';
        fadeIn(apiData);
    }, 1000); // Adjust the delay as needed (1000 milliseconds in this example)

    setTimeout(function() {
        // Call the fadeIn function for the forecast data
        forecastData.style.opacity = '1';
        fadeIn(forecastData);
    }, 1250);
});

function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);