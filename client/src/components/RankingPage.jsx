import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API/API.mjs';

const RankingPage = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                setLoading(true);
                const data = await API.getRanking();
                setRanking(data);
                setError(null);
            } catch (err) {
                console.error("ERRORE CLASSIFICA:", err);
                setError('Impossibile caricare la classifica generale della metropolitana.');
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Caricamento classifica...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Card className="shadow-sm border-0 bg-white p-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="text-primary mb-0">🏆 Classifica Generale</h1>
                        <Button variant="outline-secondary" onClick={() => navigate('/')}>
                            🏠 Torna alla Home
                        </Button>
                    </div>
                    
                    <p className="text-muted mb-4">
                        In questa pagina viene mostrato il miglior punteggio assoluti  ottenuto da ciascun macchinista della community di <em>Last Race</em>.
                    </p>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {!error && ranking.length === 0 ? (
                        <Alert variant="info">Nessun record memorizzato nel sistema. Sii il primo a giocare e a registrare un punteggio!</Alert>
                    ) : (
                        <Table striped bordered hover responsive className="align-middle text-center shadow-sm">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th style={{ width: '20%' }}>Posizione</th>
                                    <th>Nome Utente</th>
                                    <th style={{ width: '30%' }}>Record Monete Rimaste</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.map((row, index) => {
                                    // Stile grafico speciale per i primi tre posti sul podio
                                    let positionBadge = `${index + 1}°`;
                                    if (index === 0) positionBadge = '🥇 1°';
                                    if (index === 1) positionBadge = '🥈 2°';
                                    if (index === 2) positionBadge = '🥉 3°';

                                    return (
                                        <tr key={index} className={index === 0 ? "table-success fw-bold" : ""}>
                                            <td className="fs-5">{positionBadge}</td>
                                            {/* FIX: Usa "row.name" invece di "row.username" */}
                                            <td className="fw-semibold">{row.name}</td>
                                            <td>
                                                <span className="badge bg-dark fs-6 px-3 py-2 shadow-sm">
                                                    {/* FIX: Usa "row.highscore" invece di "row.score" */}
                                                    {row.highscore} 🪙
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RankingPage;