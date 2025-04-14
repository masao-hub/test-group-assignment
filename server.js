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