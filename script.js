 const container = document.getElementById("weatherContainer");
const loader = document.getElementById("loader");

const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");
const toggleTheme = document.getElementById("toggleTheme");

const cityInput = document.getElementById("cityInput");

const cities = [
{ name:"Delhi", lat:28.61, lon:77.20 },
{ name:"London", lat:51.50, lon:-0.12 },
{ name:"Tokyo", lat:35.67, lon:139.65 }
];

function weatherEmoji(code){

if(code === 0) return ["☀️","Clear"];
if(code <= 3) return ["⛅","Cloudy"];
if(code <= 48) return ["🌫","Fog"];
if(code <= 67) return ["🌧","Rain"];
if(code <= 77) return ["❄️","Snow"];
if(code <= 82) return ["🌦","Showers"];

return ["🌍","Weather"];

}

async function fetchWeatherForCities(){

container.innerHTML="";
loader.classList.remove("hidden");

try{

const requests = cities.map(city =>

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`)
.then(res => res.json())

);

const results = await Promise.all(requests);

loader.classList.add("hidden");

results.forEach((data,index)=>{

const city = cities[index];

const temp = data.current_weather.temperature;
const code = data.current_weather.weathercode;

const [emoji,condition] = weatherEmoji(code);

createCard(city.name,temp,emoji,condition);

});

}

catch{

loader.classList.add("hidden");

container.innerHTML = `<p style="color:red">Failed to load weather</p>`;

}

}

function createCard(city,temp,emoji,condition){

const card = document.createElement("div");

card.className="card";

card.innerHTML=`

<h2>${city}</h2>
<div class="emoji">${emoji}</div>
<div class="temp">${temp}°C</div>
<p>${condition}</p>

`;

container.appendChild(card);

}

searchBtn.addEventListener("click", async ()=>{

const city = cityInput.value;

if(!city) return;

loader.classList.remove("hidden");

try{

const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);

const geoData = await geo.json();

const {latitude,longitude,name} = geoData.results[0];

const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);

const weatherData = await weather.json();

loader.classList.add("hidden");

const temp = weatherData.current_weather.temperature;
const code = weatherData.current_weather.weathercode;

const [emoji,condition] = weatherEmoji(code);

createCard(name,temp,emoji,condition);

}

catch{

loader.classList.add("hidden");

alert("City not found");

}

});

refreshBtn.addEventListener("click",fetchWeatherForCities);

toggleTheme.addEventListener("click",()=>{

document.body.classList.toggle("dark");

});

fetchWeatherForCities();
