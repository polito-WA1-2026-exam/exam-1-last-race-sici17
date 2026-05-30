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
                    if(!crypto.timingSafeEqual(Buffer.from(row.password_hash, 'hex'), hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });

};


// functions to manage the actual game

// estrazione delle stazioni casuali per decidere partenza e arrivo

const getRandomStations = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM stations ORDER BY RANDOM() LIMIT 2';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length < 2) {
                reject(new Error("Stazioni insufficienti nel database"));
            } else {
                resolve({
                    start: { id: rows[0].id, name: rows[0].name, isInterchange: rows[0].is_interchange },
                    destination: { id: rows[1].id, name: rows[1].name, isInterchange: rows[1].is_interchange }
                });
            }
        });
    });
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

////////////////////////////

const DAO = {getUser, getRandomStations, getRandomEvent, getAdjacentStations, SaveMatch, getUserMatchHistory};

export default DAO;