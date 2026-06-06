# Exam #1: "Subway Last Race"
## Student: s361754 SICILIANI FRANCESCO

## React Client Application Routes

- Route `/`: Home page displaying general information and the welcome message.
- Route `/login`: Login page containing the authentication form for users.
- Route `/game`: Main gameplay page where authenticated users can start a match, select their path, and play the subway routing game.
- Route `/ranking`: Leaderboard page displaying the global ranking of users.
- Route `*`: Fallback "Not found" page for unrecognized URLs.

## API Server

- POST `/api/sessions`
  - request body content: `{ "email": "test@polito.it", "password": "password" }`
  - response body content: Logged-in user object (e.g., `{ "id": 1, "email": "test@polito.it", "name": "Test User" }`)
- GET `/api/sessions/current`
  - request parameters: None
  - response body content: Currently authenticated user object. Returns `401 Not authenticated` if no active session.
- DELETE `/api/sessions/current`
  - request parameters: None
  - response body content: Empty (Status 200). Clears the current user session.
- POST `/api/games/start`
  - request parameters: None
  - response body content: JSON object containing match details (`startStation`, `destinationStation`, `currentStationId`, `coins`, `deadline` timestamp, and `nextSteps` array).
- POST `/api/games/execute`
  - request body content: JSON array of the submitted route IDs (`{ "route": [ 2, 5, 6 ] }`)
  - response body content: JSON object with the match outcome (`valid` boolean, `finalScore`, and either an `executionSteps` array detailing applied random events, or an error `message`).
- GET `/api/games/ranking`
  - request parameters: None
  - response body content: JSON array containing the global leaderboard data.
- GET `/api/network`
  - request parameters: None
  - response body content: JSON object/array representing the full subway network map (stations and connections).

## Database Tables

- Table `users` - contains user credentials (`id`, `email`, `name`, `hash` for encrypted passwords, `salt`).
- Table `stations` - contains the subway stations (`id`, `name`, `is_interchange` boolean flag).
- Table `lines` - contains the subway line details (`id`, `name`, `color`).
- Table `connections` - contains the segments linking stations together (`id`, `line_id`, `station_a_id`, `station_b_id`).
- Table `events` - contains the random events that can occur during a trip and their score impact (`id`, `description`, `coin_modifier`).
- Table `matches` - contains the match history for the leaderboard (`id`, `user_id`, `start_station_id`, `destination_station_id`, `final_score`, `date`).

## Main React Components

- `App` (in `App.jsx`): Root component handling the React Router routing and the global authentication state.
- `GamePage` (in `components/GamePage.jsx`): Container for the main game. Coordinates the game flow between setup, active gameplay, and match results.
- `GamePlay` (in `components/GameComponents/GamePlay.jsx`): Manages the active game session, displaying valid adjacent stations and handling path selection.
- `GameTimer` (in `components/GameComponents/GameTimer.jsx`): Manages the 90-second countdown for the game session.
- `LoginPage` (in `components/LoginPage.jsx`): Handles the user login form and interacts with the authentication API.
- `RankingPage` (in `components/RankingPage.jsx`): Fetches and displays the global game leaderboard.
- `NavbarComponent` (in `components/NavbarComponent.jsx`): Navigation bar with links to the various views and the logout action.

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- `test@polito.it`, `password` (Test User)
- `mario.rossi@polito.it`, `password` (Mario Rossi)
- `luigi.verdi@polito.it`, `password` (Luigi Verdi)

## Use of AI Tools

For the realization of this project, I relied on some external resources to speed up the workflow and resolve the most complex tasks[cite: 2]:

- **Boilerplate Code (Standard Configurations)**: For the entire authentication process using Passport (LocalStrategy, user serialization) and the basic configuration of middleware like CORS and Express session management, I reused and adapted the base structure from a friend's project from last year[cite: 2].
- **Use of AI (ChatGPT/Copilot)**: I utilized Artificial Intelligence mainly as an assistant in five specific areas[cite: 2]:
  - To implement the BFS algorithm (`getRandomStations` in the DAO) to calculate a minimum distance of 3 stops between the start and destination points[cite: 2].
  - To structure the logic for validating line changes and interchange stations during the match execution route[cite: 2].
  - To quickly generate the mock data used to populate the database tables (station names, connections, and random events)[cite: 2].
  - For debugging purposes throughout the entire process, especially to quickly interpret error messages and fix asynchronous flows involving Promises[cite: 2].
  - To create all the text content displayed on the website[cite: 2].

The rest of the application logic, the structure of the API routes, and the database design were written and integrated by me from scratch[cite: 2].
