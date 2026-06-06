-- TABELLA UTENTI
-- Struttura standard identica a quella usata nel progetto dell'alunno bravo per Passport.js
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hash TEXT NOT NULL,    -- Password cifrata
    salt TEXT NOT NULL     -- Salt per la cifratura
);

-- TABELLA STAZIONI
CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    is_interchange INTEGER DEFAULT 0 -- 1 se è una stazione di interscambio, 0 altrimenti
);

-- TABELLA LINEE METROPOLITANE
CREATE TABLE IF NOT EXISTS lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT          -- Opzionale, utile per il frontend (es. 'Red', 'Blue')
);

-- TABELLA COLLEGAMENTI (I segmenti tra le stazioni)
-- Questa tabella dice che la stazione A è collegata alla stazione B su una specifica linea
CREATE TABLE IF NOT EXISTS connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_id INTEGER NOT NULL,
    station_a_id INTEGER NOT NULL,
    station_b_id INTEGER NOT NULL,
    FOREIGN KEY(line_id) REFERENCES lines(id),
    FOREIGN KEY(station_a_id) REFERENCES stations(id),
    FOREIGN KEY(station_b_id) REFERENCES stations(id)
);

-- TABELLA EVENTI CASUALI
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    coin_modifier INTEGER NOT NULL -- Valore tra -4 e +4 (es. -3 per 'Wrong platform')
);

-- TABELLA PARTITE (Match History / Leaderboard)
CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,               -- Può essere NULL se la partita è giocata da un utente anonimo (se previsto)
    start_station_id INTEGER NOT NULL,
    destination_station_id INTEGER NOT NULL,
    final_score INTEGER NOT NULL,  -- Numero di monete rimaste alla fine
    date TEXT NOT NULL,            -- Data e ora della partita
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(start_station_id) REFERENCES stations(id),
    FOREIGN KEY(destination_station_id) REFERENCES stations(id)
);



-- Inserimento Linee (Minimo 4)
INSERT INTO lines (name, color) VALUES ('Red Line', '#FF0000');
INSERT INTO lines (name, color) VALUES ('Blue Line', '#0000FF');
INSERT INTO lines (name, color) VALUES ('Green Line', '#00FF00');
INSERT INTO lines (name, color) VALUES ('Yellow Line', '#FFFF00');

-- Inserimento Stazioni (Almeno 12 stazioni, di cui almeno 3 di interscambio)
-- Interscambi principali
INSERT INTO stations (name, is_interchange) VALUES ('Centrale', 1);
INSERT INTO stations (name, is_interchange) VALUES ('Porta Velaria', 1);
INSERT INTO stations (name, is_interchange) VALUES ('Fontana Oscura', 1);
INSERT INTO stations (name, is_interchange) VALUES ('Torre Cinerea', 1);
-- Altre stazioni
INSERT INTO stations (name, is_interchange) VALUES ('Crocevia del Falco', 0);
INSERT INTO stations (name, is_interchange) VALUES ('Piazza delle Lanterne', 1);
INSERT INTO stations (name, is_interchange) VALUES ('Borgo Sereno', 0);
INSERT INTO stations (name, is_interchange) VALUES ('Viale dei Mosaici', 1);
INSERT INTO stations (name, is_interchange) VALUES ('Campo dell''Eco', 1);
INSERT INTO stations (name, is_interchange) VALUES ('Quartiere Olmi', 0);
INSERT INTO stations (name, is_interchange) VALUES ('Parco Nord', 0);
INSERT INTO stations (name, is_interchange) VALUES ('Stazione Est', 0);

-- Inserimento Collegamenti (Tratte tra le stazioni)
-- Esempio Red Line: Centrale <-> Porta Velaria <-> Crocevia del Falco <-> Piazza delle Lanterne
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (1, 1, 2); -- Centrale - Porta Velaria
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (1, 2, 5); -- Porta Velaria - Crocevia del Falco
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (1, 5, 6); -- Crocevia del Falco - Piazza delle Lanterne

-- Esempio Blue Line: Centrale <-> Fontana Oscura <-> Borgo Sereno <-> Viale dei Mosaici
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (2, 1, 3); -- Centrale - Fontana Oscura
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (2, 3, 7); -- Fontana Oscura - Borgo Sereno
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (2, 7, 8); -- Borgo Sereno - Viale dei Mosaici

-- Esempio Green Line: Porta Velaria <-> Fontana Oscura <-> Torre Cinerea <-> Campo dell'Eco
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (3, 2, 3); -- Porta Velaria - Fontana Oscura
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (3, 3, 4); -- Fontana Oscura - Torre Cinerea
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (3, 4, 9); -- Torre Cinerea - Campo dell'Eco

-- Esempio Yellow Line: Piazza delle Lanterne <-> Torre Cinerea <-> Viale dei Mosaici <-> Campo dell'Eco
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (4, 6, 4); -- Piazza delle Lanterne - Torre Cinerea
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (4, 4, 8); -- Torre Cinerea - Viale dei Mosaici
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (4, 8, 9); -- Viale dei Mosaici - Campo dell'Eco
-- Aggiungiamo altre tratte per coprire le stazioni rimanenti (10, 11, 12) su qualche linea...
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (1, 6, 10); -- Piazza delle Lanterne - Quartiere Olmi
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (2, 8, 11); -- Viale dei Mosaici - Parco Nord
INSERT INTO connections (line_id, station_a_id, station_b_id) VALUES (3, 9, 12); -- Campo dell'Eco - Stazione Est

-- Inserimento Eventi Casuali (Almeno 8, con modificatori tra -4 e +4)
INSERT INTO events (description, coin_modifier) VALUES ('Piattaforma sbagliata!', -3);
INSERT INTO events (description, coin_modifier) VALUES ('Ispezione del biglietto positiva!', 2);
INSERT INTO events (description, coin_modifier) VALUES ('Treno in ritardo!', -2);
INSERT INTO events (description, coin_modifier) VALUES ('Hai trovato una moneta su un sedile!', 1);
INSERT INTO events (description, coin_modifier) VALUES ('Scipero della metro!', -4);
INSERT INTO events (description, coin_modifier) VALUES ('Metro espresso, che veloce!', 3);
INSERT INTO events (description, coin_modifier) VALUES ('Pickpocket ti hanno attaccato!', -1);
INSERT INTO events (description, coin_modifier) VALUES ('Vecchietto generoso ti offre un caffe', 4);

-- Inserimento di un utente di test (Password: 'password')
-- Nota: Per fare le cose fatte bene come l'alunno, la password nel DB deve essere l'hash+salt. 
-- Per ora inseriamo un utente finto, poi useremo una funzione Node per fare l'inserimento corretto.
INSERT INTO users (email, name, hash, salt) VALUES 
('test@polito.it', 'Test User', '83eabb8a686aec81375626273adcc5fccc144df0b4fc8a0fd3c1d5d7e88109fc', '012a640ff8e45e1ef68eba1ca9afda01'),
('mario.rossi@polito.it', 'Mario Rossi', '83eabb8a686aec81375626273adcc5fccc144df0b4fc8a0fd3c1d5d7e88109fc', '012a640ff8e45e1ef68eba1ca9afda01'),
('luigi.verdi@polito.it', 'Luigi Verdi', '83eabb8a686aec81375626273adcc5fccc144df0b4fc8a0fd3c1d5d7e88109fc', '012a640ff8e45e1ef68eba1ca9afda01');



-- Inserimento di alcune partite per i primi 2 utenti
-- Aggiunta la colonna "date" per rispettare il vincolo NOT NULL
INSERT INTO matches (user_id, start_station_id, destination_station_id, final_score, date) VALUES 
-- Partite per l'utente 1 (Test User)
(1, 1, 5, 12, '2026-06-01'),
(1, 2, 8, 5, '2026-06-02'),

-- Partite per l'utente 2 (Mario Rossi)
(2, 3, 7, 18, '2026-06-03'),
(2, 4, 9, 21, '2026-06-04');