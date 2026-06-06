import React from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import '../../styles/GameResult.css'; 

export const VictoryGameResult = ({ score, resetGame, goHome }) => {
    // se il punteggio finale è negativo, viene mostrato come 0
    const displayScore = score < 0 ? 0 : score;

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="text-center shadow-lg p-4 border-success" style={{ width: '30rem' }}>
                <Card.Body>
                    <h1 className="text-success mb-3">🎉 Vittoria! 🎉</h1>
                    <h5 className="text-muted mb-4">Sei arrivato a destinazione!</h5>
                    
                    <div className="bg-light p-4 rounded mb-4 shadow-sm">
                        <h2 className="display-2 fw-bold text-success m-0">{displayScore}</h2>
                        <p className="text-muted m-0 mt-2">Monete Finali</p>
                    </div>

                    <div className="d-grid gap-3">
                        <Button variant="success" size="lg" onClick={resetGame}>
                            🔄 Gioca Ancora
                        </Button>
                        <Button variant="outline-secondary" onClick={goHome}>
                             Torna alla Home
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export const DefeatGameResult = ({ score = 0, isTimeout, resetGame, goHome }) => {
    // mostriamo sempre zero, per sconfitta o rotta invalida 
    const displayScore = score < 0 ? 0 : score;

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="text-center shadow-lg p-4 border-danger" style={{ width: '30rem' }}>
                <Card.Body>
                    <h1 className="text-danger mb-3">💀 Sconfitta 💀</h1>
                    
                    <h5 className="text-muted mb-4">
                        {isTimeout 
                            ? "Tempo scaduto! Non hai confermato la rotta in tempo." 
                            : "Il tuo viaggio è fallito o la rotta era invalida!"}
                    </h5>
                    
                    <div className="bg-light p-4 rounded mb-4 shadow-sm">
                        <h2 className="display-2 fw-bold text-danger m-0">{displayScore}</h2>
                        <p className="text-muted m-0 mt-2">Monete Finali</p>
                    </div>

                    <div className="d-grid gap-3">
                        <Button variant="danger" size="lg" onClick={resetGame}>
                            🔄 Riprova
                        </Button>
                        <Button variant="outline-secondary" onClick={goHome}>
                             Torna alla Home
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};