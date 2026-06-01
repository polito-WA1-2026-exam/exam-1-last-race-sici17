import sqlite from 'sqlite3'
import crypto from 'crypto'

// database connecting
const db = new sqlite.Database('db.sqlite', (err)=>{
    if (err) throw err;
})

// function to manage the users

export const getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = {id: row.id, email: row.email, name: row.name};

                crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
                    if (err) reject(err);
                    if(!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });

};


// functions to manage the actual game

const getRandomStations = async () => {

    const getAllStations = () => new Promise((resolve, reject) => {
        db.all('SELECT * FROM stations', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
    
    const getAllConnections = () => new Promise((resolve, reject) => {
        db.all('SELECT station_a_id, station_b_id FROM connections', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    try {
        const stations = await getAllStations();
        const connections = await getAllConnections();

        // grafo delle adiacenze 
        const graph = {};
        stations.forEach(s => graph[s.id] = []);
        connections.forEach(c => {
            graph[c.station_a_id].push(c.station_b_id);
            graph[c.station_b_id].push(c.station_a_id);
        });

        const shuffledStations = stations.sort(() => 0.5 - Math.random());

        // Breadth-First Search
        for (const startStation of shuffledStations) {
            const distances = {};
            const queue = [startStation.id];
            distances[startStation.id] = 0;

            // Calcoliamo la distanza minima dalla stazione di partenza a tutte le altre
            while (queue.length > 0) {
                const current = queue.shift();
                for (const neighbor of graph[current]) {
                    if (distances[neighbor] === undefined) {
                        distances[neighbor] = distances[current] + 1;
                        queue.push(neighbor);
                    }
                }
            }

            // Filtriamo solo le destinazioni raggiungibili che distano ALMENO 3 fermate
            const validDestinations = stations.filter(s => distances[s.id] >= 3);

            // Se troviamo destinazioni valide, ne scegliamo una a caso e restituiamo la coppia
            if (validDestinations.length > 0) {
                const destStation = validDestinations[Math.floor(Math.random() * validDestinations.length)];
                return {
                    start: { id: startStation.id, name: startStation.name, isInterchange: startStation.is_interchange },
                    destination: { id: destStation.id, name: destStation.name, isInterchange: destStation.is_interchange }
                };
            }
        }
        
        throw new Error("Impossibile trovare due stazioni con distanza minima di 3 fermate nella rete attuale.");
    } catch (error) {
        throw error;
    }
};



// estrazione dell'evento casuale, molto simile al caso sopra

const getRandomEvent = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM events ORDER BY RANDOM() LIMIT 1';
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: row.id,
                    description: row.description,
                    coinModifier: row.coin_modifier
                });
            }
        });
    });
};

// stazioni adiacenti alla stazione attualmente in uso

const getAdjacentStations = (currentStationId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT s.id, s.name, s.is_interchange, l.name as line_name, l.color as line_color
            FROM connections c
            JOIN stations s ON (c.station_a_id = s.id OR c.station_b_id = s.id)
            JOIN lines l ON c.line_id = l.id
            WHERE (c.station_a_id = ? OR c.station_b_id = ?) AND s.id != ?
        `;
        db.all(sql, [currentStationId, currentStationId, currentStationId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(r => ({
                    id: r.id,
                    name: r.name,
                    isInterchange: r.is_interchange,
                    lineName: r.line_name,
                    lineColor: r.line_color
                })));
            }
        });
    });
};


// registro la partita conclusa nella tabella matches, gestisco il caso degli utenti non registrati

const SaveMatch = (userId, startStationId, destinationStationId, finalScore) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO matches (user_id, start_station_id, destination_station_id, final_score, date)
            VALUES (?, ?, ?, ?, datetime("now"))
        `;
        db.run(sql, [userId, startStationId, destinationStationId, finalScore], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};


// Ottiene la cronologia delle partite di un utente
const getUserMatchHistory = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                m.id,
                m.date,
                m.final_score,
                s1.name as start_station,
                s2.name as dest_station
            FROM matches m
            JOIN stations s1 ON m.start_station_id = s1.id
            JOIN stations s2 ON m.destination_station_id = s2.id
            WHERE m.user_id = ?
            ORDER BY m.date DESC
        `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(r => ({
                    id: r.id,
                    date: r.date,
                    finalScore: r.final_score,
                    startStation: r.start_station,
                    destinationStation: r.dest_station
                })));
            }
        });
    });
};




const getGlobalRanking = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT users.id, users.name, MAX(matches.final_score) as highscore
      FROM matches
      JOIN users ON matches.user_id = users.id
      GROUP BY users.id
      ORDER BY highscore DESC
    `;
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};



////////////////////////////

const DAO = {getUser, getRandomStations, getRandomEvent, getAdjacentStations, SaveMatch, getUserMatchHistory, getGlobalRanking};

export default DAO;