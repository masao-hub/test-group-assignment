// server.js (for Vercel)
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Configure CORS properly
app.use(cors({
  origin: 'https://masao-hub.github.io',
  methods: ['GET'],
  allowedHeaders: ['x-apisports-key']
}));

const API_KEY = '18bfa311c68130dc921b372a01377789'; // Replace with your actual key
const BASE_URL = 'https://v3.football.api-sports.io';

app.get('/api/*', async (req, res) => {
  try {
    const endpoint = req.params[0];
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      headers: {
        'x-apisports-key': API_KEY
      },
      params: req.query
    });
    
    // Add proper CORS headers to the response
    res.header('Access-Control-Allow-Origin', 'https://masao-hub.github.io');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data 
    });
  }
});

module.exports = app;