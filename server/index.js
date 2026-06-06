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
    req.session.startStationId = null;
    req.session.currentStationId = null;
    req.session.destinationStationId = null;
    req.session.coins = null;
    req.session.startTime = null;
}

function setUpSession(req, startStation, destinationStation) {
    req.session.startStationId = startStation.id;
    req.session.currentStationId = startStation.id;
    req.session.destinationStationId = destinationStation.id;
    req.session.coins = 20; 
    req.session.startTime = Date.now(); 
}


passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' }, 
  async function verify(username, password, cb) {
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
app.post('/api/games/start',isLoggedIn, async (req, res) => {
  try {
    const route = await dao.getRandomStations();
    setUpSession(req, route.start, route.destination);

    const nextSteps = await dao.getAdjacentStations(route.start.id);

    res.status(201).json({
      startStation: route.start,
      destinationStation: route.destination,
      currentStationId: req.session.currentStationId,
      coins: req.session.coins,
      deadline: req.session.startTime + 90000,
      nextSteps: nextSteps
    });
  } catch (error) {
    console.error('Error starting new game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// user route execution
app.post('/api/games/execute', isLoggedIn, async (req, res) => {
  try {
    if (!req.session.startStationId || !req.session.destinationStationId)
      return res.status(403).json({ error: 'No game in progress' });

    const { route } = req.body; 
    if (!route || !Array.isArray(route))
      return res.status(422).json({ error: 'Invalid route format' });

    let currentStationId = req.session.startStationId;
    let coins = req.session.coins; // parte da 20
    let isValid = true;
    let isTimeout = false;

    const timeElapsed = Date.now()-req.session.startTime;
    if (req.session.startTime && timeElapsed > 90000) {
      isValid = false;
      isTimeout = true;
    }

    // validazione del percorso inviato
  if(!isTimeout){
    if (route.length === 0 || parseInt(route[route.length - 1]) !== req.session.destinationStationId) {
      isValid = false;
    } else {
      // controllo adiacenze e cambi linea
      let currentLine = null;
      let isCurrentStationInterchange = 1; // Default a 1 per la partenza (il primo spostamento è sempre valido)

      for (const nextStationId of route) {
        const validSteps = await dao.getAdjacentStations(currentStationId);
        
        // Troviamo i dettagli specifici del segmento che l'utente vuole percorrere
        let stepInfo = validSteps.find(s => s.id === parseInt(nextStationId) && (currentLine === null || s.lineName === currentLine));

        if (!stepInfo) {
          stepInfo = validSteps.find(s => s.id === parseInt(nextStationId));
        }

        if (!stepInfo) {
          isValid = false; // La stazione non è adiacente, rotta invalida!
          break;
        }

        // Se stiamo già viaggiando su una linea e la linea del prossimo segmento è diversa...
        if (currentLine !== null && currentLine !== stepInfo.lineName) {
          // ...dobbiamo assicurarci che la stazione da cui stiamo partendo sia un interscambio!
          if (isCurrentStationInterchange === 0) {
            isValid = false; // Cambio di linea illegale!
            break;
          }
        }

        // Aggiorniamo le variabili per il ciclo successivo
        currentLine = stepInfo.lineName; 
        isCurrentStationInterchange = stepInfo.isInterchange; // Salviamo se la stazione in cui arriviamo ora è un interscambio
        currentStationId = parseInt(nextStationId);
      }
    }
  }

    const userId = req.user.id;

    // failed path
    if (!isValid) {
      coins = 0; 
      await dao.SaveMatch(userId, req.session.startStationId, req.session.destinationStationId, coins);
      clearSession(req);
      
      return res.status(200).json({
        valid: false,
        finalScore: coins,
        message: 'Invalid or incomplete route. You lost all your coins.'
      });
    }

    // correct path
    const executionSteps = [];
    currentStationId = req.session.startStationId;

    for (const nextStationId of route) {      
      const event = await dao.getRandomEvent();
      coins += event.coinModifier;
      
      executionSteps.push({
        stationId: parseInt(nextStationId),
        event: event,
        coinsAfterEvent: coins
      });
      
      currentStationId = parseInt(nextStationId);
    }

    // "If the final score is negative it will be stored and shown as zero"
    if (coins < 0) {
      coins = 0;
    }

    await dao.SaveMatch(userId, req.session.startStationId, req.session.destinationStationId, coins);
    clearSession(req);

    res.status(200).json({
      valid: true,
      finalScore: coins,
      executionSteps: executionSteps
    });

  } catch (error) {
    console.error('Error executing route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/games/ranking', isLoggedIn, async (req, res) => {
  try {
    const ranking = await dao.getGlobalRanking();
    res.status(200).json(ranking);
  } catch (error) {
    console.error('Error fetching global ranking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/network',isLoggedIn, async (req, res) => {
  try {
    const network = await dao.getNetworkMap();
    res.json(network);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


