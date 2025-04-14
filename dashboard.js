document.addEventListener('DOMContentLoaded', async function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            // Load data for the selected tab if empty
            if (tabId === 'players' && document.getElementById('playersGrid').innerHTML === '') {
                loadPlayers();
            } else if (tabId === 'teams' && document.getElementById('teamsGrid').innerHTML === '') {
                loadTeams();
            } else if (tabId === 'matches' && document.getElementById('matchesList').innerHTML === '') {
                loadMatches();
            }
        });
    });
    
    // Load initial data for the active tab
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    if (activeTab === 'players') {
        await loadPlayers();
    } else if (activeTab === 'teams') {
        await loadTeams();
    } else if (activeTab === 'matches') {
        await loadMatches();
    }
    
    // Load favorites
    loadFavorites();
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', handleSearch);
    
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('playerModal').style.display = 'none';
            document.getElementById('teamModal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});

async function loadPlayers() {
    const playersGrid = document.getElementById('playersGrid');
    playersGrid.innerHTML = '<p>Loading players...</p>';
    
    const players = await fetchTopPlayers();
    
    if (players.length === 0) {
        playersGrid.innerHTML = '<p>No players found.</p>';
        return;
    }
    
    playersGrid.innerHTML = '';
    
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
            <img src="${player.player.photo}" alt="${player.player.name}" class="player-image" onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'">
            <div class="player-info">
                <div class="player-name">${player.player.name}</div>
                <div class="player-position">${player.statistics[0].games.position}</div>
                <div class="player-team">${player.statistics[0].team.name}</div>
                <button class="favorite-btn" data-id="${player.player.id}" data-type="player">★ Favorite</button>
            </div>
        `;
        
        playerCard.addEventListener('click', () => showPlayerDetails(player.player.id));
        playersGrid.appendChild(playerCard);
    });
    
    // Add event listeners to favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(this.getAttribute('data-id'), this.getAttribute('data-type'), this);
        });
    });
}

async function loadTeams() {
    const teamsGrid = document.getElementById('teamsGrid');
    teamsGrid.innerHTML = '<p>Loading teams...</p>';
    
    const teams = await fetchTopTeams();
    
    if (teams.length === 0) {
        teamsGrid.innerHTML = '<p>No teams found.</p>';
        return;
    }
    
    teamsGrid.innerHTML = '';
    
    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <img src="${team.team.logo}" alt="${team.team.name}" class="team-logo" onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'">
            <div class="team-info">
                <div class="team-name">${team.team.name}</div>
                <div class="team-country">${team.team.country}</div>
                <div class="team-rank">Rank: ${team.rank}</div>
                <button class="favorite-btn" data-id="${team.team.id}" data-type="team">★ Favorite</button>
            </div>
        `;
        
        teamCard.addEventListener('click', () => showTeamDetails(team.team.id));
        teamsGrid.appendChild(teamCard);
    });
    
    // Add event listeners to favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(this.getAttribute('data-id'), this.getAttribute('data-type'), this);
        });
    });
}

async function loadMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '<p>Loading matches...</p>';
    
    const matches = await fetchRecentMatches();
    
    if (matches.length === 0) {
        matchesList.innerHTML = '<p>No matches found.</p>';
        return;
    }
    
    matchesList.innerHTML = '';
    
    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        const date = new Date(match.fixture.date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        matchCard.innerHTML = `
            <div class="teams">
                <div class="team">
                    <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" class="team-logo-small" onerror="this.src='https://via.placeholder.com/40?text=H'">
                    <span>${match.teams.home.name}</span>
                </div>
                <div class="score">
                    ${match.goals.home} - ${match.goals.away}
                </div>
                <div class="team">
                    <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" class="team-logo-small" onerror="this.src='https://via.placeholder.com/40?text=A'">
                    <span>${match.teams.away.name}</span>
                </div>
            </div>
            <div class="match-info">
                ${formattedDate}<br>
                ${match.league.name} - ${match.league.round}
            </div>
        `;
        
        matchesList.appendChild(matchCard);
    });
}

async function showPlayerDetails(playerId) {
    const player = await fetchPlayerInfo(playerId);
    if (!player) {
        alert('Failed to load player details');
        return;
    }
    
    const stats = player.statistics[0];
    const modalContent = document.getElementById('playerDetails');
    
    modalContent.innerHTML = `
        <div class="player-details">
            <div class="detail-header">
                <img src="${player.player.photo}" alt="${player.player.name}" class="detail-image" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <div class="detail-info">
                    <h2>${player.player.name}</h2>
                    <p><strong>Age:</strong> ${player.player.age}</p>
                    <p><strong>Nationality:</strong> ${player.player.nationality}</p>
                    <p><strong>Height:</strong> ${player.player.height || 'N/A'}</p>
                    <p><strong>Weight:</strong> ${player.player.weight || 'N/A'}</p>
                    <p><strong>Team:</strong> ${stats.team.name}</p>
                    <p><strong>Position:</strong> ${stats.games.position}</p>
                    <button class="favorite-btn" data-id="${player.player.id}" data-type="player">★ Favorite</button>
                </div>
            </div>
            
            <div class="stats-section">
                <h3>Season Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${stats.games.appearences || 0}</div>
                        <div class="stat-label">Appearances</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.games.minutes || 0}</div>
                        <div class="stat-label">Minutes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.goals.total || 0}</div>
                        <div class="stat-label">Goals</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.goals.assists || 0}</div>
                        <div class="stat-label">Assists</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.shots.on || 0}</div>
                        <div class="stat-label">Shots on Target</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.passes.accuracy || 0}%</div>
                        <div class="stat-label">Pass Accuracy</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.tackles.total || 0}</div>
                        <div class="stat-label">Tackles</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.duels.won || 0}</div>
                        <div class="stat-label">Duels Won</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listener to favorite button in modal
    document.querySelector('#playerModal .favorite-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFavorite(this.getAttribute('data-id'), this.getAttribute('data-type'), this);
    });
    
    document.getElementById('playerModal').style.display = 'block';
}

async function showTeamDetails(teamId) {
    const team = await fetchTeamInfo(teamId);
    if (!team) {
        alert('Failed to load team details');
        return;
    }
    
    const modalContent = document.getElementById('teamDetails');
    
    modalContent.innerHTML = `
        <div class="team-details">
            <div class="detail-header">
                <img src="${team.team.logo}" alt="${team.team.name}" class="detail-image" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <div class="detail-info">
                    <h2>${team.team.name}</h2>
                    <p><strong>Country:</strong> ${team.team.country}</p>
                    <p><strong>Founded:</strong> ${team.team.founded || 'N/A'}</p>
                    <p><strong>Venue:</strong> ${team.venue.name || 'N/A'}</p>
                    <p><strong>Venue City:</strong> ${team.venue.city || 'N/A'}</p>
                    <p><strong>Venue Capacity:</strong> ${team.venue.capacity ? team.venue.capacity.toLocaleString() : 'N/A'}</p>
                    <button class="favorite-btn" data-id="${team.team.id}" data-type="team">★ Favorite</button>
                </div>
            </div>
            
            <div class="stats-section">
                <h3>Team Statistics</h3>
                <p>More detailed team statistics would be displayed here from the API.</p>
            </div>
        </div>
    `;
    
    // Add event listener to favorite button in modal
    document.querySelector('#teamModal .favorite-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFavorite(this.getAttribute('data-id'), this.getAttribute('data-type'), this);
    });
    
    document.getElementById('teamModal').style.display = 'block';
}

function loadFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<li>No favorites yet</li>';
        return;
    }
    
    favorites.forEach(fav => {
        const li = document.createElement('li');
        li.textContent = fav.name;
        li.addEventListener('click', () => {
            if (fav.type === 'player') {
                showPlayerDetails(fav.id);
            } else if (fav.type === 'team') {
                showTeamDetails(fav.id);
            }
        });
        favoritesList.appendChild(li);
    });
}

function toggleFavorite(id, type, button) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(fav => fav.id === id && fav.type === type);
    
    if (index === -1) {
        // Add to favorites
        const name = button.closest('.player-card, .team-card, .detail-info').querySelector('.player-name, .team-name, h2').textContent;
        favorites.push({ id, type, name });
        button.textContent = '★ Favorited';
        button.style.backgroundColor = '#fbbc05';
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
        button.textContent = '★ Favorite';
        button.style.backgroundColor = '#1a73e8';
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
}

async function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    
    const searchResults = await searchFootballData(query);
    if (searchResults.length === 0) {
        alert('No results found');
        return;
    }
    
    // For simplicity, we'll just show the first result in a modal
    const firstResult = searchResults[0];
    if (firstResult.player) {
        showPlayerDetails(firstResult.player.id);
    } else if (firstResult.team) {
        showTeamDetails(firstResult.team.id);
    }
}