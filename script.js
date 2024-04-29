const weatherApiKey = "c57035f450c43b60613e5ec03b7f3805";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastApiUrl = "http://api.openweathermap.org/data/2.5/forecast";
const airQualityApiKey = "9e73b59b4ac34a6989fe26241410d2a2930d7ed4";
const airQualityApiUrl = "https://api.waqi.info/feed/";
const searchInput = document.getElementById("search");
const submitButton = document.getElementById("submit");
const temp = document.querySelector('.temp');
const nameOutput = document.querySelector('.name');
const humidity = document.querySelector('.humidity');
const thumidity = document.querySelector('.thumidity');
const wind = document.querySelector('.wind');
const type = document.querySelector('.weathertype');
const visibility = document.querySelector('.visibility');
const humidityStatus = document.querySelector('.status');
const visibilityStatus = document.querySelector('.visibility-status');
const airQualityElement = document.querySelector('.air');
const airStatusElement = document.querySelector('.air-status');
const app = document.querySelector('.second');
const day = document.querySelectorAll('.day');
const weather = document.querySelectorAll('.weather');
const speed = document.querySelectorAll('.speed');
const temperature = document.querySelectorAll('.temperature');
const icons = document.querySelectorAll('.icons-img');
const farBtn = document.querySelector('.far');
const celBtn = document.querySelector('.cel');

const html = document.querySelector("html");
const themebtn = document.getElementById("theme-toggle");

if (localStorage.getItem("mode") == "dark") {
    darkMode();
} else {
    lightMode();
}
themebtn.addEventListener('click', (e) => {
    if (localStorage.getItem("mode") == "light") {
        darkMode();
    } else {
        lightMode();
    }
})

function darkMode() {
    html.classList.add("dark");
    themebtn.classList.replace("ri-moon-line", "ri-sun-line");
    localStorage.setItem("mode", "dark");
}

function lightMode() {
    html.classList.remove("dark");
    themebtn.classList.replace("ri-sun-line", "ri-moon-line");
    localStorage.setItem("mode", "light");
}



let cityInput;
let isCelsius = true; // Default temperature unit is Celsius

farBtn.addEventListener('click', () => {
    isCelsius = false; // Set temperature unit to Fahrenheit
    celBtn.classList.remove('change-color'); // Remove the dot (.) before class name
    farBtn.classList.add('change-color')
    fetchWeatherAndAirQuality();
});

celBtn.addEventListener('click', () => {
    isCelsius = true; // Set temperature unit to Celsius
    farBtn.classList.remove('change-color'); // Remove the dot (.) before class name
    celBtn.classList.add('change-color');
    fetchWeatherAndAirQuality();
});

function updateTime() {
    const now = new Date();
    const day = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const formattedDay = days[day];

    const hours = now.getHours();
    let minutes = now.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero for single-digit minutes

    const amPm = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convert to 12-hour format and handle noon case
    const date = String(now.getDate()).padStart(2, '0');

    const formattedTime = `${adjustedHours}:${minutes} ${amPm}`;

    // Use toLocaleDateString with 'long' format for full month name
    const formattedDate = `${formattedDay} , ${date} ${now.toLocaleDateString('default', { month: 'long' })} ${now.getFullYear()}`;

    document.querySelector(".current_time").textContent = formattedTime;
    document.querySelector(".current_date").textContent = formattedDate;
}

updateTime();
setInterval(updateTime, 1000);

const cityCards = document.querySelectorAll('.city');

cityCards.forEach(card => {
    card.addEventListener('click', () => {
        cityInput = card.querySelector('.city-name').innerText;
        fetchWeatherAndAirQuality();
    });
});

submitButton.addEventListener("click", () => {
    cityInput = searchInput.value.trim();
    if (cityInput !== "") {
        fetchWeatherAndAirQuality();
    } else {
        console.log("Please enter a city name");
        alert("Please enter the city name");
    }
});                                                                                 

function fetchWeatherAndAirQuality() {
    const weatherApiUrlWithParams = `${weatherApiUrl}?q=${cityInput}&appid=${weatherApiKey}&units=metric`;
    const airQualityApiUrlWithParams = `${airQualityApiUrl}${cityInput}/?token=${airQualityApiKey}`;
    const futureApiUrlWithParms = `http://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=c57035f450c43b60613e5ec03b7f3805&units=metric`;


    fetch(weatherApiUrlWithParams)
        .then((response) => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then((weatherData) => {
            // Update weather UI
            searchInput.value = "";
            temp.innerHTML = isCelsius ? `${weatherData.main.temp}°C` : `${celsiusToFahrenheit(weatherData.main.temp)}°F`;
            nameOutput.innerHTML = weatherData.name;
            humidity.innerHTML = `${weatherData.main.humidity}%`;
            thumidity.innerHTML = `${weatherData.main.humidity}%`;
            type.innerHTML = `${weatherData.weather[0].main}`;
            wind.innerHTML = `${weatherData.wind.speed.toFixed(1)}km`
            const visibilityInKm = weatherData.visibility / 1000;
            visibility.innerHTML = `${visibilityInKm.toFixed(1)} km`;

            // Update humidity status
            const humidityValue = weatherData.main.humidity;
            if (humidityValue < 40) {
                humidityStatus.innerHTML = "Low";
            } else if (humidityValue >= 40 && humidityValue <= 60) {
                humidityStatus.innerHTML = "Normal";
            } else {
                humidityStatus.innerHTML = "High";
            }

            // Update visibility status
            const visibilityValue = visibilityInKm;
            if (visibilityValue < 3) {
                visibilityStatus.innerHTML = "Low";
            } else if (visibilityValue >= 3 && visibilityValue <= 10) {
                visibilityStatus.innerHTML = "Normal";
            } else {
                visibilityStatus.innerHTML = "High";
            }

            // Update background image based on weather type
            updateBackgroundImage(type.innerHTML);
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error.message);
            alert("City not found");
        });

    fetch(airQualityApiUrlWithParams)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Air quality data not available");
            }
            return response.json();
        })
        .then((airQualityData) => {
            const aqi = airQualityData.data.aqi;
            airQualityElement.innerHTML = aqi;

            // Update air quality status
            if (aqi >= 0 && aqi <= 50) {
                airStatusElement.innerHTML = "Good";
            } else if (aqi >= 51 && aqi <= 100) {
                airStatusElement.innerHTML = "Moderate";
            } else if (aqi >= 101 && aqi <= 150) {
                airStatusElement.innerHTML = "Unhealthy for Sensitive Groups";
            } else if (aqi >= 151 && aqi <= 200) {
                airStatusElement.innerHTML = "Unhealthy";
            } else if (aqi >= 201 && aqi <= 300) {
                airStatusElement.innerHTML = "Very Unhealthy";
            } else {
                airStatusElement.innerHTML = "Hazardous";
            }
        })
        .catch((error) => {
            console.error("Error fetching air quality data:", error.message);
            airQualityElement.innerHTML = "N/A";
            airStatusElement.innerHTML = "Data unavailable";
        });

    fetch(futureApiUrlWithParms)
        .then((response) => {
            if (!response.ok) {
                throw new Error("future data not available");
            }
            return response.json();
        })
        .then((futureData) => {
            const midnightData = [futureData.list[1], ...futureData.list.filter(item => item.dt_txt.endsWith("00:00:00"))];

            
            midnightData.forEach((item, index) => {
                // Update the content of each div
                day[index].textContent = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                temperature[index].textContent = isCelsius ? `${item.main.temp.toFixed(1)}°C` : `${celsiusToFahrenheit(item.main.temp)}°F`;
                speed[index].textContent = `${item.wind.speed.toFixed(1)}km/h`;
                weather[index].textContent = item.weather[0].main;

                if (weather[index].textContent == "Clouds") {
                    icons[index].src = '/images/cloudy-1.png';
                } else if (weather[index].textContent == "Rain") {
                    icons[index].src = '/images/rainy-1.png';
                } else if (weather[index].textContent == "Clear") {
                    icons[index].src = '/images/sunny.png';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function updateBackgroundImage(weatherType) {
    if (weatherType === 'Clouds') {
        app.style.backgroundImage = `url(./images/cloud-1.jpg)`;
    } else if (weatherType === 'Clear') {
        app.style.backgroundImage = `url(./images/blue-1.jpg)`;
    } else if (weatherType === 'Snow') {
        app.style.backgroundImage = `url(./images/snowy.jpg)`;
    } else if (weatherType === 'Haze') {
        app.style.backgroundImage = `url(./images/haze.jpg)`;
    }
}

function celsiusToFahrenheit(celsius) {
    return ((celsius * 9 / 5) + 32).toFixed(1); // Round to 1 decimal place
}





