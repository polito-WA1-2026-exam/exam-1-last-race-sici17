import React from 'react';
import { Card, Button, Container } from 'react-bootstrap';
// Importiamo il CSS (ho visto che hai un GameResult.css nei file del progetto)
import '../../styles/GameResult.css'; 

export const VictoryGameResult = ({ score, resetGame, goHome }) => {
    // Specifica dell'esame: se il punteggio finale è negativo, viene mostrato come 0
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
                            🏠 Torna alla Home
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export const DefeatGameResult = ({ score = 0, resetGame, goHome }) => {
    // Anche in caso di sconfitta o rotta invalida mostriamo 0 (le specifiche dicono che il giocatore perde le 20 monete o se va sotto zero mostra 0)
    const displayScore = score < 0 ? 0 : score;

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="text-center shadow-lg p-4 border-danger" style={{ width: '30rem' }}>
                <Card.Body>
                    <h1 className="text-danger mb-3">💀 Sconfitta 💀</h1>
                    <h5 className="text-muted mb-4">Il tuo viaggio è fallito o la rotta era invalida!</h5>

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
                            🏠 Torna alla Home
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};