// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('public')); // frontend serve kare

// Weather route
app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    try {
        // 1️⃣ Convert city to lat/lon
        const geoRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.API_KEY}`);
        const geoData = await geoRes.json();
        if (!geoData.length) return res.json({ error: "City not found" });

        const { lat, lon, name, country } = geoData[0];

        // 2️⃣ Get weather
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_KEY}`);
        const weatherData = await weatherRes.json();

        res.json({
            city: name,
            country: country,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            wind: weatherData.wind.speed
        });
    } catch (err) {
        console.error(err);
        res.json({ error: "Error fetching weather" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
