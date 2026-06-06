import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SetupPhase from "./GameComponents/SetupPhase.jsx";
import GamePlay from "./GameComponents/GamePlay.jsx";
import ExecutionPhase from "./GameComponents/ExecutionPhase.jsx";
import { VictoryGameResult, DefeatGameResult } from "./GameComponents/GameResult.jsx";
import API from "../API/API.mjs";

const GamePage = (props) => {

    const navigate = useNavigate();
    const [gamePhase, setGamePhase] = useState('setup'); 
    const [network, setNetwork] = useState(null);
    const [gameData, setGameData] = useState(null); // id partita, startStation, destStation
    const [route, setRoute] = useState([]); // array dei tratti selezionati dall'utente
    const [timeLeft, setTimeLeft] = useState(90);
    const [gameDeadline, setGameDeadline] = useState(null); 
    const [executionResult, setExecutionResult] = useState(null);

    // caricamento della rete metropolitana 
    useEffect(() => {
        const fetchNetwork = async () => {
            try {
                const data = await API.getNetwork();
                setNetwork(data);
            } catch (error) {
                if (import.meta.env.DEV) 
                    console.error('fetch network:', error);
                props.setMessage('Errore: loading the map is impossible');
            }
        };
        fetchNetwork();
    }, []);

    // timer 
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
            return () => clearInterval(timer); 
        }
    }, [gameDeadline, gamePhase]);

    const startGame = async () => {
        try {
            props.setMessage(null);
            const data = await API.startNewGame(); // fornisce gameId, startStation, destStation, deadline

            setGameData(data);
            setRoute([]);
            setGameDeadline(data.deadline);
            setGamePhase('planning');
        } catch (error) {
            if (import.meta.env.DEV) 
                console.error('Error starting game:', error);
            props.setMessage(`Errore: impossibile avviare la partita`);
        }
    };

    const handleSegmentSelect = (segment) => {
        if (route.some(s => s.id === segment.id)) {
            setRoute(route.filter(s => s.id !== segment.id));
        } else {
            setRoute([...route, segment]);
        }
    };

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
              setGamePhase('defeat'); 
            } 
            
        } catch (error) {
            if (import.meta.env.DEV) 
                console.error('Error submitting route:', error);
            props.setMessage({ msg: 'error during route verification', type: 'danger' });
        }
    };

    const handleTimeUp = async () => {
        setGameDeadline(null); 
        
        try {
            const routePayload = calculateStationRoute();
            const result = await API.submitRoute(routePayload);
            
            const formattedResult = {
                won: !!result.valid,
                finalScore: result.finalScore || 0,
                isTimeout: true, 
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
              setGamePhase('defeat'); 
            } 
        } catch (error) {
            setExecutionResult({
                won: false,
                finalScore: 0, 
                isTimeout: true, 
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
    };

    const goHome = () => navigate('/');

    if (!network) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div>Loading</div>
            </div>
        );
    }

    return (
        <div className="main-game-page">
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
        </div>
    );
};

export default GamePage;