const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = '18bfa311c68130dc921b372a01377789'; // Replace with your actual key
const BASE_URL = 'https://v3.football.api-sports.io';

app.get('/api/*', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/${req.params[0]}`, {
            headers: {
                'x-apisports-key': API_KEY
            },
            params: req.query
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));