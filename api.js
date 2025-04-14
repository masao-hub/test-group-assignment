// API configuration
const API_KEY = '84295d246eb4154054a355b0682a3439';
const BASE_URL = 'https://v3.football.api-sports.io';

// Common headers for API requests
const headers = {
    'x-apisports-key': API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};
// Fetch top players
async function fetchTopPlayers(season = 2023, leagueId = 39) {
    try {
        console.log("Fetching players..."); 
        const response = await fetch(`${BASE_URL}/players/topscorers?season=${season}&league=${leagueId}`, {
            method: 'GET',
            headers: headers
        });
        
        console.log("API Response:", response);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(`API request failed: ${errorData.message || response.status}`);
        }
        
        const data = await response.json();
        console.log("API Data:", data);
        return data.response || [];
    } catch (error) {
        console.error('Full Error:', error);
        return [];
    }
}

// Fetch team information
async function fetchTeamInfo(teamId) {
    try {
        const response = await fetch(`${BASE_URL}/teams?id=${teamId}`, {
            method: 'GET',
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        return data.response[0];
    } catch (error) {
        console.error('Error fetching team info:', error);
        return null;
    }
}

// Fetch player information
async function fetchPlayerInfo(playerId) {
    try {
        const response = await fetch(`${BASE_URL}/players?id=${playerId}&season=2023`, {
            method: 'GET',
            headers: headers 
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        return data.response[0];
    } catch (error) {
        console.error('Error fetching player info:', error);
        return null;
    }
}

// Fetch top teams
async function fetchTopTeams(season = 2023, leagueId = 39) { // Premier League by default
    try {
        const response = await fetch(`${BASE_URL}/standings?season=${season}&league=${leagueId}`, {
            method: 'GET',
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        return data.response[0].league.standings[0];
    } catch (error) {
        console.error('Error fetching top teams:', error);
        return [];
    }
}

// Fetch recent matches
async function fetchRecentMatches(season = 2023, leagueId = 39, last = 10) { // Last 10 matches by default
    try {
        const response = await fetch(`${BASE_URL}/fixtures?league=${leagueId}&season=${season}&last=${last}`, {
            method: 'GET',
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error fetching recent matches:', error);
        return [];
    }
}

// Search players or teams
async function searchFootballData(query) {
    try {
        const response = await fetch(`${BASE_URL}/players?search=${query}`, {
            method: 'GET',
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error searching football data:', error);
        return [];
    }
}