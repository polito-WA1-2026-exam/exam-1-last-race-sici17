import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SetupPhase from "./GameComponents/SetupPhase.jsx";
import GamePlay from "./GameComponents/GamePlay.jsx";
import ExecutionPhase from "./GameComponents/ExecutionPhase.jsx";
import { VictoryGameResult, DefeatGameResult } from "./GameComponents/GameResult.jsx";
import API from "../API/API.mjs";
import "../styles/GamePage.css";

const GamePage = (props) => {
    const navigate = useNavigate();
    const [gamePhase, setGamePhase] = useState('setup'); // setup, planning, execution, victory, defeat
    const [network, setNetwork] = useState(null);
    const [gameData, setGameData] = useState(null); // id partita, startStation, destStation
    const [route, setRoute] = useState([]); // Array dei tratti selezionati dall'utente
    const [timeLeft, setTimeLeft] = useState(90);
    const [gameDeadline, setGameDeadline] = useState(null); // Ricevuta dal server
    const [executionResult, setExecutionResult] = useState(null);
    const [gameStats, setGameStats] = useState({ coins: 20, segmentsCount: 0 });

    // Caricamento asincrono della rete metropolitana al mount
    useEffect(() => {
        const fetchNetwork = async () => {
            try {
                const data = await API.getNetwork();
                setNetwork(data);
            } catch (error) {
                if (import.meta.env.DEV) 
                    console.error('Error fetching network:', error);
                props.setMessage('Errore: impossibile caricare la mappa della rete metropolitana');
            }
        };
        fetchNetwork();
    }, []);

    // Timer ad alta precisione ereditato dallo stile di Gioco Sfortuna
    useEffect(() => {
        if (gamePhase === 'planning' && gameDeadline) {
            const updateTimer = () => {
                const now = Date.now();
                const remaining = Math.max(0, Math.ceil((gameDeadline - now) / 1000));
                setTimeLeft(remaining);

                if (remaining === 0) {
                    handleTimeUp();
                }
            };

            updateTimer();
            const timer = setInterval(updateTimer, 1000);
            return () => clearInterval(timer); // Cleanup anti-parallelismo
        }
    }, [gameDeadline, gamePhase]);

    const startGame = async () => {
        try {
            props.setMessage(null);
            const data = await API.startNewGame(); // Fornisce gameId, startStation, destStation, deadline

            setGameData(data);
            setRoute([]);
            setGameDeadline(data.deadline);
            setGameStats({ coins: 20, segmentsCount: 0 });
            setGamePhase('planning');
        } catch (error) {
            if (import.meta.env.DEV) 
                console.error('Error starting game:', error);
            props.setMessage(`Errore: impossibile avviare la partita`);
        }
    };

    const handleSegmentSelect = (segment) => {
        // Se il segmento è già presente nella rotta lo rimuove (toggle), altrimenti lo aggiunge
        if (route.some(s => s.id === segment.id)) {
            setRoute(route.filter(s => s.id !== segment.id));
        } else {
            setRoute([...route, segment]);
        }
    };

    const handleConfirmRoute = async () => {
        try {
            props.setMessage(null);
            const routePayload = route.map(segment => segment.id);
            const result = await API.submitRoute(routePayload);
            setExecutionResult(result); // Ritorna { won: true/false, finalScore: X, events: [...] }
            setGamePhase('execution');
        } catch (error) {
            if (import.meta.env.DEV) 
                console.error('Error submitting route:', error);
            props.setMessage({msg: 'Errore: impossibile caricare la mappa della rete metropolitana', type: 'danger' });
        }
    };

    const handleTimeUp = async () => {
        try {
            // Sottomette la rotta corrente allo scadere del tempo
            const routePayload = route.map(segment => segment.id);
            const result = await API.submitRoute(routePayload);
            setExecutionResult(result);
            setGamePhase('execution');
        } catch (error) {
            if (import.meta.env.DEV) 
                console.error('Error handling timeout:', error);
            props.setMessage(`Errore: tempo scaduto, invio di emergenza fallito`);
        }
    };

    const handleExecutionComplete = () => {
        if (executionResult.won) {
            setGamePhase('victory');
        } else {
            setGamePhase('defeat');
        }
    };

    const resetGame = () => {
        setGamePhase('setup');
        setGameData(null);
        setRoute([]);
        setTimeLeft(90);
        setGameDeadline(null);
        setExecutionResult(null);
        props.setMessage(null);
        setGameStats({ coins: 20, segmentsCount: 0 });
    };

    const goHome = () => navigate('/');

    if (!network) {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div>Caricamento della rete metropolitana in corso...</div>
        </div>
    );
}

    return (
        <>
            {gamePhase === 'setup' && network && (
                <SetupPhase network={network} onStartGame={startGame} />
            )}
            {gamePhase === 'planning' && gameData && (
                <GamePlay 
                    gameData={gameData}
                    network={network}
                    route={route}
                    timeLeft={timeLeft}
                    handleSegmentSelect={handleSegmentSelect}
                    handleConfirmRoute={handleConfirmRoute}
                    gameStats={{ ...gameStats, segmentsCount: route.length }}
                />
            )}
            {gamePhase === 'execution' && executionResult && (
                <ExecutionPhase 
                    events={executionResult.events} 
                    onComplete={handleExecutionComplete}
                />
            )}
            {gamePhase === 'victory' && executionResult && (
                <VictoryGameResult score={executionResult.finalScore} resetGame={resetGame} goHome={goHome} />
            )}
            {gamePhase === 'defeat' && executionResult && (
                <DefeatGameResult score={executionResult.finalScore} resetGame={resetGame} goHome={goHome} />
            )}
        </>
    );
};

export default GamePage;