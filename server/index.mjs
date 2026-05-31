// imports
import express from 'express';
import morgan from 'morgan';
import dao from "./dao.mjs";
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json()); 
app.use(morgan('dev'));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public'))); // per servire eventuali file statici/immagini

// sessions in express
app.use(session({
  secret: "ciao king",
  resave: false,
  saveUninitialized: false,
}));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
};
app.use(cors(corsOptions));

//inizializziamo passport
app.use(passport.authenticate('session'));

//auth middleware
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

//functions to manage  the session (contains info about game in progress)
function clearSession(req) {
    req.session.currentGameId = null;
    req.session.cardsWon = 0;
    req.session.roundsLost = 0;
}

function setUpSession(req, startStation, destinationStation) {
    req.session.startStationId = startStation.id;
    req.session.currentStationId = startStation.id;
    req.session.destinationStationId = destinationStation.id;
    req.session.coins = 20; // Come richiesto dalla traccia
}


passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await dao.getUser(username, password);
    if(!user)
        return cb(null, false, 'Incorrect username or password.');

    return cb(null, user);
}));


// user managment apiS
app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
    res.status(201).json(req.user);
});

app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// game management apis

// start match
app.post('/api/games/start', async (req, res) => {
  try {
    const route = await dao.getRandomStations();
    setUpSession(req, route.start, route.destination);

    const nextSteps = await dao.getAdjacentStations(route.start.id);

    res.status(201).json({
      startStation: route.start,
      destinationStation: route.destination,
      currentStationId: req.session.currentStationId,
      coins: req.session.coins,
      nextSteps: nextSteps
    });
  } catch (error) {
    console.error('Error starting new game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// user roaming
app.post('/api/games/step', async (req, res) => {
  try {
    if (!req.session.currentStationId)
      return res.status(403).json({ error: 'No game in progress' });

    const { nextStationId } = req.body;

    const validSteps = await dao.getAdjacentStations(req.session.currentStationId);
    const isValid = validSteps.some(s => s.id === parseInt(nextStationId));

    if (!isValid)
      return res.status(422).json({ error: 'Invalid position' });

    req.session.coins -= 1;
    req.session.currentStationId = parseInt(nextStationId);

    const event = await dao.getRandomEvent();
    req.session.coins += event.coinModifier;

    let status = 'playing';
    if (req.session.currentStationId === req.session.destinationStationId && req.session.coins >= 0) {
      status = 'won';
    } else if (req.session.coins <= 0) {
      status = 'lost';
      if (req.session.coins < 0) req.session.coins = 0;
    }

    if (status === 'won' || status === 'lost') {
      const userId = req.isAuthenticated() ? req.user.id : null;
      await dao.recordMatch(userId, req.session.startStationId, req.session.destinationStationId, req.session.coins);
      clearSession(req);
    }

    const nextSteps = status === 'playing' ? await dao.getAdjacentStations(req.session.currentStationId) : [];

    res.status(200).json({
      status: status,
      currentStationId: req.session.currentStationId,
      coins: req.session.coins,
      appliedEvent: event,
      nextSteps: nextSteps
    });
  } catch (error) {
    console.error('Error processing step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/history', isLoggedIn, async (req, res) => {
  try {
    const history = await dao.getUserMatchHistory(req.user.id);
    res.json(history);
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// history api
app.get('/api/users/history', isLoggedIn, async (req, res) => {
    try {
        const history = await dao.getUserMatchHistory(req.user.id);
        res.json(history);
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


