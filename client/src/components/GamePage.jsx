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
            // setGameStats({ coins: 20, segmentsCount: 0 }); <--- RIGA ELIMINATA
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

    // Calcola la sequenza ordinata degli ID delle stazioni seguendo i passaggi
    const calculateStationRoute = () => {
        if (!gameData || !gameData.startStation) return [];
        let currentStationId = gameData.startStation.id;
        const finalRouteStations = [];

        for (const segment of route) {
            if (segment.station_a_id === currentStationId) {
                finalRouteStations.push(segment.station_b_id);
                currentStationId = segment.station_b_id;
            } else if (segment.station_b_id === currentStationId) {
                finalRouteStations.push(segment.station_a_id);
                currentStationId = segment.station_a_id;
            } else {
                // Fallback di sicurezza se la rotta ha discontinuità
                finalRouteStations.push(segment.station_b_id);
                currentStationId = segment.station_b_id;
            }
        }
        return finalRouteStations;
    };

    const handleConfirmRoute = async () => {
        try {
            props.setMessage(null);
            const routePayload = calculateStationRoute();
            const result = await API.submitRoute(routePayload);
            
            // Adattamento e mapping dei dati da Backend a Frontend
            const formattedResult = {
                won: !!result.valid,
                finalScore: result.finalScore,
                events: (result.executionSteps || []).map(step => {
                    const stationObj = network.stations.find(s => s.id === step.stationId);
                    return {
                        station: stationObj ? stationObj.name : `Stazione ${step.stationId}`,
                        description: step.event ? step.event.description : "Nessun imprevisto",
                        coinChange: step.event ? step.event.coinModifier : 0
                    };
                })
            };

            setExecutionResult(formattedResult); 
            if (formattedResult.won) {
                setGamePhase('execution');
            } else {
              setGamePhase('defeat'); // Salta direttamente alla schermata di sconfitta
            } 
            
        } catch (error) {
            if (import.meta.env.DEV) 
                console.error('Error submitting route:', error);
            props.setMessage({ msg: 'Errore durante la verifica della rotta', type: 'danger' });
        }
    };

    const handleTimeUp = async () => {
        // 1. Fermiamo subito il timer per evitare loop infiniti e crash
        setGameDeadline(null); 
        
        try {
            const routePayload = calculateStationRoute();
            const result = await API.submitRoute(routePayload);
            
            const formattedResult = {
                won: !!result.valid,
                finalScore: result.finalScore || 0,
                isTimeout: true, // Passiamo il flag
                events: (result.executionSteps || []).map(step => {
                    const stationObj = network.stations.find(s => s.id === step.stationId);
                    return {
                        station: stationObj ? stationObj.name : `Stazione ${step.stationId}`,
                        description: step.event ? step.event.description : "Nessun imprevisto",
                        coinChange: step.event ? step.event.coinModifier : 0
                    };
                })
            };

            setExecutionResult(formattedResult); 
            if (formattedResult.won) {
                setGamePhase('execution');
            } else {
              setGamePhase('defeat'); // Salta direttamente alla schermata di sconfitta
            } 
        } catch (error) {
            // 2. Se il server restituisce errore (es. rotta incompleta),
            // andiamo diretti alla pagina di sconfitta per timeout senza crashare
            setExecutionResult({
                won: false,
                finalScore: 0, // Nessun punteggio in caso di mancato invio
                isTimeout: true, // Segnaliamo che è per colpa del timeout
                events: []
            });
            setGamePhase('defeat');
        }
    };

    const handleExecutionComplete = () => {
        if (executionResult && executionResult.won) {
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
        // setGameStats({ coins: 20, segmentsCount: 0 }); <--- RIGA ELIMINATA
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
                    gameStats={{ coins: 20, segmentsCount: route.length }} 
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
                <DefeatGameResult score={executionResult.finalScore} isTimeout={executionResult.isTimeout} resetGame={resetGame} goHome={goHome} />
            )}
        </>
    );
};

export default GamePage;