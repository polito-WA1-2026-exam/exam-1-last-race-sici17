// API Functions
const API_URL = 'http://localhost:3001/api';

// --- User management APIs ---
const login = async (credentials) => {
    const response = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed');
    }

    return await response.json();
};

const logout = async () => {
    const response = await fetch(`${API_URL}/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }
};

const getUserInfo = async () => {
    const response = await fetch(`${API_URL}/sessions/current`, {
        method: 'GET',
        credentials: 'include'
    });

    if (response.ok) {
        return await response.json();
    }
    return null;
};

// --- Game management APIs ---

// Recupera la mappa completa della rete metropolitana (Fase di Setup)
const getNetwork = async () => {
    const response = await fetch(`${API_URL}/network`, {
        method: 'GET',
        credentials: 'include' 
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to get subway network');
    }

    return await response.json();
};

// Inizia una nuova partita assegnando stazione di partenza e di destinazione
const startNewGame = async () => {
    const response = await fetch(`${API_URL}/games/start`, {
        method: 'POST',
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to start new game');
    }

    return await response.json();
};

// Invia il percorso completato dal giocatore per validazione ed esecuzione
const submitRoute = async (route) => {
    const response = await fetch(`${API_URL}/games/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ route }) 
    });
    if (!response.ok) throw new Error('Failed to submit route');
    return await response.json();
};

// --- Global Ranking API ---

// Sostituisce la vecchia getUserHistory, recupera i migliori punteggi
const getRanking = async () => {
    const response = await fetch(`${API_URL}/games/ranking`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to get global ranking');
    return await response.json();
};

const API = {
    // user management
    login,
    logout,
    getUserInfo, // Usato in App.jsx per l'auth persistente

    // game management
    getNetwork,
    startNewGame,
    submitRoute,

    // ranking
    getRanking
};

export default API;