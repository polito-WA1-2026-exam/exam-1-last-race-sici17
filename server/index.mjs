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

//functions to manage session (contains info about game in progress)
function clearSession(req) {
    req.session.currentGameId = null;
    req.session.cardsWon = 0;
    req.session.roundsLost = 0;
}

function setUpSession(req, newGameId) {
    req.session.currentGameId = newGameId;
    req.session.cardsWon = 3;
    req.session.roundsLost = 0;
}