# Exam #1: "Subway Last Race"
## Student: s361754 SICILIANI FRANCESCO

## React Client Application Routes

- Route `/`: Home page displaying general information, instructions, and the welcome message.
- Route `/login`: Login page containing the authentication form for users.
- Route `/game`: Main gameplay page where authenticated users can start a match, select their path, and execute the route.
- Route `/ranking`: Leaderboard page displaying the global ranking of users.
- Route `*`: Fallback "Not found" page for unrecognized URLs.

## API Server

- POST `/api/sessions`
  - Parameters: None. Body: `{ "email": "test@polito.it", "password": "password" }`
  - Exchanged objects: Returns the logged-in user object (e.g., `{ "id": 1, "email": "...", "name": "..." }`).
- GET `/api/sessions/current`
  - Parameters: None.
  - Exchanged objects: Returns the currently authenticated user object, or `401` error object if not authenticated.
- DELETE `/api/sessions/current`
  - Parameters: None. 
  - Exchanged objects: Empty response (Status 200). Clears the current user session.
- POST `/api/games/start`
  - Parameters: None.
  - Exchanged objects: Returns a JSON object with match details (`startStation`, `destinationStation`, `currentStationId`, `coins`, `deadline`, and `nextSteps` array).
- POST `/api/games/execute`
  - Parameters: None. Body: JSON array of submitted route IDs (`{ "route": [ 2, 5, 6 ] }`).
  - Exchanged objects: Returns a JSON object with the match outcome (`valid` boolean, `finalScore`, and either an `executionSteps` array detailing events or an error message).
- GET `/api/games/ranking`
  - Parameters: None.
  - Exchanged objects: Returns a JSON array of objects representing the global leaderboard data.
- GET `/api/network`
  - Parameters: None.
  - Exchanged objects: Returns a JSON object/array representing the full subway network map.

## Database Tables

- Table `users` - Contains user credentials and authentication data (`id`, `email`, `name`, `hash`, `salt`).
- Table `stations` - Contains the subway stations data (`id`, `name`, `is_interchange`).
- Table `lines` - Contains the subway lines details (`id`, `name`, `color`).
- Table `connections` - Contains the segments linking stations together to form the network (`id`, `line_id`, `station_a_id`, `station_b_id`).
- Table `events` - Contains the random events occurring during a trip and their impact on coins (`id`, `description`, `coin_modifier`).
- Table `matches` - Contains the match history used to generate the global leaderboard (`id`, `user_id`, `start_station_id`, `destination_station_id`, `final_score`, `date`).

## Main React Components

- `App` (in `App.jsx`): Root component handling the React Router paths and the global authentication state.
- `GamePage` (in `components/GamePage.jsx`): Container for the main game, managing the flow between setup, active gameplay, and results.
- `GamePlay` (in `components/GameComponents/GamePlay.jsx`): Manages the active game session, displaying valid adjacent stations and handling path selection.
- `GameTimer` (in `components/GameComponents/GameTimer.jsx`): Manages the 90-second countdown for the planning phase of the game session.
- `LoginPage` (in `components/LoginPage.jsx`): Handles the user login form and interacts with the API for authentication.
- `RankingPage` (in `components/RankingPage.jsx`): Fetches and displays the global game leaderboard.
- `NavbarComponent` (in `components/NavbarComponent.jsx`): Navigation bar with links to the various views and the logout action.

## Screenshots

![Game Phase](./img/game_screenshot.jpg)

![Ranking Page](./img/ranking_screenshot.jpg)

## Users Credentials

- `test@polito.it`, `password` (Test User)
- `mario.rossi@polito.it`, `password` (Mario Rossi)
- `luigi.verdi@polito.it`, `password` (Luigi Verdi)

## Use of AI Tools

For the realization of this project, I relied on some external resources to speed up the workflow and resolve the most complex tasks:

- **Boilerplate Code (Standard Configurations)**: For the entire authentication process using Passport (LocalStrategy, user serialization) and the basic configuration of middleware like CORS and Express session management, I reused and adapted the base structure from a friend's project from last year.
- **Use of AI (ChatGPT/Copilot)**: I utilized Artificial Intelligence mainly as an assistant in five specific areas:
  - To implement the BFS algorithm (`getRandomStations` in the DAO) to calculate a minimum distance of 3 stops between the start and destination points.
  - To structure the logic for validating line changes and interchange stations during the match execution route.
  - To quickly generate the mock data used to populate the database tables (station names, connections, and random events).
  - For debugging purposes throughout the entire process, especially to quickly interpret error messages and fix asynchronous flows involving Promises.
  - To create all the text content displayed on the website.

The rest of the application logic, the structure of the API routes, and the database design were written and integrated by me from scratch.
