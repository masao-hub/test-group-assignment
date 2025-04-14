// API configuration
const API_KEY = '18bfa311c68130dc921b372a01377789';
const BASE_URL = 'https://test-group-assignment.vercel.app/api';
// Common headers for API requests
const headers = {
    'x-apisports-key': API_KEY
};
// Fetch top players
async function fetchTopPlayers(season = 2023, leagueId = 39) {
    try {
        console.log("Fetching players from:", `${BASE_URL}/players/topscorers?season=${season}&league=${leagueId}`);
        
        const response = await fetch(`${BASE_URL}/players/topscorers?season=${season}&league=${leagueId}`, {
            method: 'GET',
            headers: {
                'x-apisports-key': API_KEY // Make sure this is defined
            }
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Received data:", data);
        return data.response || [];
    } catch (error) {
        console.error('Full Error:', error);
        // Show user-friendly error
        document.getElementById('playersGrid').innerHTML = `
            <div class="error">
                <p>Failed to load players</p>
                <p>${error.message}</p>
                <button onclick="loadPlayers()">Retry</button>
            </div>
        `;
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