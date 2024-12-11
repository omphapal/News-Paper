let currentPage = 1;
let currentCategory = 'general';
let currentQuery = '';

// Fetch news function
const fetchNews = async (page = 1, category = 'general', query = '') => {
  try {
    document.getElementById('loadingSpinner').style.display = 'flex';
    document.getElementById('newsContainer').innerHTML = '';
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&q=${query}&pageSize=6&page=${page}&apiKey=641fee61f058441e9b150aa6867f77fd`;
    const response = await fetch(url);
    const data = await response.json();
    document.getElementById('loadingSpinner').style.display = 'none';

    if (!data.articles.length) {
      document.getElementById('newsContainer').innerHTML = '<p class="text-center text-muted">No news articles found.</p>';
      return;
    }

    data.articles.forEach(article => {
      const card = `
        <div class="col-lg-4 col-md-6">
          <div class="card my-3">
            <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${article.title || 'No Image'}">
            <div class="card-body">
              <h5 class="card-title">${article.title || 'No Title'}</h5>
              <p class="card-text">${article.description || 'No Description available.'}</p>
              <a href="${article.url}" class="btn btn-primary" target="_blank">Read More</a>
              <button class="btn btn-bookmark" onclick="saveBookmark('${article.url}')">Bookmark</button>
            </div>
          </div>
        </div>`;
      document.getElementById('newsContainer').insertAdjacentHTML('beforeend', card);
    });
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};

// Filter News by category
const filterNews = (category) => {
  currentCategory = category;
  currentPage = 1;
  fetchNews(currentPage, currentCategory, currentQuery);
};

// Save Bookmark functionality
const saveBookmark = (url) => {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  if (!bookmarks.includes(url)) {
    bookmarks.push(url);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert('Article bookmarked!');
  } else {
    alert('Already bookmarked!');
  }
};

// Toggle Dark/Light mode
const toggleMode = () => {
  document.body.classList.toggle('dark-mode');
  const navbar = document.querySelector('.navbar');
  navbar.classList.toggle('navbar-dark');
  navbar.classList.toggle('navbar-light');
  const modeBtn = document.getElementById('modeToggle');
  if (document.body.classList.contains('dark-mode')) {
    modeBtn.innerHTML = '🌞'; // Sun for light mode
    localStorage.setItem('mode', 'dark');
  } else {
    modeBtn.innerHTML = '🌙'; // Moon for dark mode
    localStorage.setItem('mode', 'light');
  }
};

// Set initial mode based on local storage
const initialMode = localStorage.getItem('mode') || 'light';
if (initialMode === 'dark') {
  toggleMode();
}

// Date & Clock
const updateDateClock = () => {
  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = now.toLocaleTimeString();
  document.getElementById('dateClock').innerHTML = `${formattedDate} | ${formattedTime}`;
};

setInterval(updateDateClock, 1000); // Update clock every second

// Fetch weather (Replace with actual API key)
const fetchWeather = async () => {
let city = document.getElementById('cityInput').value || 'New York';  // Default to New York if no input
const apiKey = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}';  // Replace with your OpenWeather API key
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

try {
  const response = await fetch(url);
  const data = await response.json();

  if (data.cod === 200) {
      const temperature = data.main.temp;
      const weatherDescription = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

      document.getElementById('weatherCity').innerHTML = city;
      document.getElementById('weatherTemp').innerHTML = `${temperature}°C`;
      document.getElementById('weatherDescription').innerHTML = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
      document.getElementById('weatherHumidity').innerHTML = `Humidity: ${humidity}%`;
      document.getElementById('weatherWind').innerHTML = `Wind: ${windSpeed} m/s`;
      document.getElementById('weatherIcon').src = weatherIcon;
      document.getElementById('weatherIcon').alt = weatherDescription;
  } else {
      document.getElementById('weatherInfo').innerHTML = `<p class="text-danger">City not found. Please try again.</p>`;
  }
} catch (error) {
  console.error('Error fetching weather:', error);
  document.getElementById('weatherInfo').innerHTML = `<p class="text-danger">Error fetching weather data.</p>`;
}
};

// Fetch weather based on user location
const fetchWeatherByLocation = async () => {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}';  // Replace with your OpenWeather API key
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.cod === 200) {
              const temperature = data.main.temp;
              const weatherDescription = data.weather[0].description;
              const humidity = data.main.humidity;
              const windSpeed = data.wind.speed;
              const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

              document.getElementById('weatherCity').innerHTML = data.name;
              document.getElementById('weatherTemp').innerHTML = `${temperature}°C`;
              document.getElementById('weatherDescription').innerHTML = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
              document.getElementById('weatherHumidity').innerHTML = `Humidity: ${humidity}%`;
              document.getElementById('weatherWind').innerHTML = `Wind: ${windSpeed} m/s`;
              document.getElementById('weatherIcon').src = weatherIcon;
              document.getElementById('weatherIcon').alt = weatherDescription;
          } else {
              document.getElementById('weatherInfo').innerHTML = `<p class="text-danger">Error fetching location weather.</p>`;
          }
      } catch (error) {
          console.error('Error fetching location-based weather:', error);
          document.getElementById('weatherInfo').innerHTML = `<p class="text-danger">Error fetching weather data.</p>`;
      }
  }, () => {
      alert('Unable to retrieve your location.');
  });
} else {
  alert('Geolocation is not supported by this browser.');
}
};

// Fetch weather for the user's location on page load
fetchWeatherByLocation();

// Allow users to input a city to get weather
document.getElementById('getWeatherBtn').addEventListener('click', fetchWeather);


// Initial news fetch
fetchNews(currentPage, currentCategory, currentQuery);
