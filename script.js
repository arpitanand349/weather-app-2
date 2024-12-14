// Weather Fetch Functionality
document.getElementById('getWeather').addEventListener('click', () => {
    const cityName = document.getElementById('city').value; // Get city from input field with id="city"
    const apiKey = '5f510a658aa5c5264064b594ef31a7ec'; // Your API key
    const weatherInfo = document.getElementById('weatherInfo');
    const error = document.getElementById('error');
    const aqiInfo = document.getElementById('aqiInfo'); // AQI info section
 
    // Check if the city name is empty
  if (!cityName) {
    error.textContent = 'Please enter a city name';
    error.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    aqiInfo.classList.add('hidden'); // Hide AQI info if city is empty
    return;
}

 // Fetch weather data using the city name and API key
 fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName},IN&appid=${apiKey}&units=metric`)
 .then(response => {
     if (!response.ok) {
         throw new Error(`Error: ${response.statusText}`);
     }
     return response.json();
 })
 .then(data => {
     console.log(data); // For debugging to see the full data

     // Display weather information for the first forecast entry
     const firstForecast = data.list[0];
     document.getElementById('cityName').textContent = `Weather Forecast for ${data.city.name}`;
     document.getElementById('temp').textContent = `Temperature: ${firstForecast.main.temp}°C`;
     document.getElementById('description').textContent = `Description: ${firstForecast.weather[0].description}`;
     // Fetch and display the weather icon dynamically
     const iconCode = firstForecast.weather[0].icon;
     document.getElementById('icon').src = `https://openweathermap.org/img/wn/${iconCode}.png`;

     weatherInfo.classList.remove('hidden');
     error.classList.add('hidden');

     // Fetch AQI data for the city
     fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.city.coord.lat}&lon=${data.city.coord.lon}&appid=${apiKey}`)
         .then(response => response.json())
         .then(aqiData => {
             const aqi = aqiData.list[0].main.aqi;
             document.getElementById('aqi').textContent = `AQI: ${aqi}`;

             // Map AQI values to corresponding tips
             const aqiTips = {
                 1: 'Good air quality, enjoy the outdoors!',
                 2: 'Fair air quality, moderate outdoor activities.',
                 3: 'Unhealthy for sensitive groups, avoid prolonged exposure.',
                 4: 'Unhealthy air quality, stay indoors if possible.',
                 5: 'Very unhealthy, avoid all outdoor activities.'
             };

             // Get the AQI tips based on the value
             document.getElementById('aqiTips').textContent = aqiTips[aqi] || 'No AQI data available.';

             // Show AQI information
             aqiInfo.classList.remove('hidden');
         })
         .catch(err => {
             console.error(err);
             aqiInfo.classList.add('hidden');
         });
 })
 .catch(err => {
     console.error(err);
     weatherInfo.classList.add('hidden');
     aqiInfo.classList.add('hidden');
     error.textContent = 'City not found or API issue. Please try again.';
     error.classList.remove('hidden');
 });
});

// Location access functionality
document.addEventListener('DOMContentLoaded', () => {
    // Show the location permission modal as soon as the page loads
    document.getElementById('locationModal').style.display = 'flex';

    // If the user clicks "Allow", request the location and fetch weather data
    document.getElementById('allowBtn').addEventListener('click', () => {
        if (navigator.geolocation) {
            // Get the user's location
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const apiKey = '5f510a658aa5c5264064b594ef31a7ec';

                // Fetch weather data using latitude and longitude
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                    .then(response => response.json())
                    .then(data => {
                        const firstForecast = data.list[0];
                        document.getElementById('cityName').textContent = `Weather at your location`;
                        document.getElementById('temp').textContent = `Temperature: ${firstForecast.main.temp}°C`;
                        document.getElementById('description').textContent = `Description: ${firstForecast.weather[0].description}`;
                        document.getElementById('icon').src = `https://openweathermap.org/img/wn/${firstForecast.weather[0].icon}.png`;

                        // Fetch AQI data
                        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                            .then(response => response.json())
                            .then(aqiData => {
                                const aqi = aqiData.list[0].main.aqi;
                                document.getElementById('aqi').textContent = `AQI: ${aqi}`;

                                // Map AQI values to corresponding tips
                                const aqiTips = {
                                    1: 'Good air quality, enjoy the outdoors!',
                                    2: 'Fair air quality, moderate outdoor activities.',
                                    3: 'Unhealthy for sensitive groups, avoid prolonged exposure.',
                                    4: 'Unhealthy air quality, stay indoors if possible.',
                                    5: 'Very unhealthy, avoid all outdoor activities.'
                                };

                                // Get the AQI tips based on the value
                                document.getElementById('aqiTips').textContent = aqiTips[aqi] || 'No AQI data available.';

                                // Show AQI information
                                document.getElementById('aqiInfo').classList.remove('hidden');
                            })
                            .catch(err => {
                                console.error(err);
                                document.getElementById('aqiInfo').classList.add('hidden');
                            });

                        // Show weather information
                        document.getElementById('weatherInfo').classList.remove('hidden');
                        document.getElementById('error').classList.add('hidden');
                    })
                    .catch(err => {
                        console.error(err);
                        document.getElementById('weatherInfo').classList.add('hidden');
                        document.getElementById('error').textContent = 'Could not retrieve weather data.';
                        document.getElementById('error').classList.remove('hidden');
                    });
            });
        }
        // Hide the modal after allowing location access
        document.getElementById('locationModal').style.display = 'none';
    });

    // If the user clicks "Deny", simply hide the modal
    document.getElementById('denyBtn').addEventListener('click', () => {
        // Hide the modal without accessing location
        document.getElementById('locationModal').style.display = 'none';
    });
});

// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const body = document.body;

    // Check if dark mode preference is saved in localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    }

    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
        }
    });
});
