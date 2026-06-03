import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Spinner, Alert } from 'react-bootstrap';
import API from '../API/API.mjs';

const RankingPage = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const data = await API.getRanking();
                setRanking(data);
                setLoading(false);
            } catch (err) {
                setError('Impossibile caricare la classifica generale.');
                setLoading(false);
            }
        };
        fetchRanking();
    }, []);

    if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

    return (
        <Container className="my-5">
            <Card className="shadow-sm">
                <Card.Header className="bg-dark text-white text-center py-3">
                    <h2 className="mb-0">🏆 Classifica Generale 🏆</h2>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive className="text-center mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Giocatore</th>
                                <th>Miglior Punteggio (Monete)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranking.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-muted py-4">Nessun punteggio registrato al momento.</td>
                                </tr>
                            ) : (
                                ranking.map((player, index) => (
                                    <tr key={index} className={index === 0 ? 'table-warning fw-bold' : ''}>
                                        <td>{index + 1}</td>
                                        <td>{player.username}</td>
                                        <td>{player.bestScore} 🪙</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RankingPage;