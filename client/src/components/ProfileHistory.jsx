import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Card, Badge, Alert, Spinner, Image} from 'react-bootstrap';
import API from '../api/API';
import '../styles/ProfileHistory.css';

const ProfileHistory = ({ user }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const historyData = await API.getUserHistory();
                setHistory(historyData);
            } catch (err) {
                setError('Errore nel caricamento della cronologia delle partite');
                if (import.meta.env.DEV)//show only if not in production
                    console.error('Error fetching history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const utcDate = new Date(dateString+"Z");
        return utcDate.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getResultBadge = (isWon) => {
        return isWon ? (
            <Badge bg="success" className="result-badge">
                <span className="badge-icon">🏆</span>
                Vittoria
            </Badge>
        ) : (
            <Badge bg="danger" className="result-badge">
                <span className="badge-icon">💥</span>
                Sconfitta
            </Badge>
        );
    };

    const getCardStatusIcon = (isWon) => {
        return isWon ? '✅' : '❌';
    };

    const separateCards = (cards) => {
        const initialCards = cards.filter(card => card.roundNumber === null);
        const roundCards = cards.filter(card => card.roundNumber !== null)
            .sort((a, b) => a.roundNumber - b.roundNumber);

        return { initialCards, roundCards };
    };

    if (loading) {
        return (
            <Container className="profile-history-container">
                <div className="loading-section">
                    <Spinner animation="border" variant="primary" />
                    <p className="loading-text">Caricamento cronologia...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="profile-history-container">
                <Alert variant="danger" className="error-alert">
                    <Alert.Heading>Oops! Qualcosa è andato storto</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="profile-history-container">
            <Row>
                <Col>
                    {/* Header */}
                    <div className="history-header">
                        <div className="header-content">
                            <h1 className="history-title">
                                <span className="title-icon">📊</span>
                                Cronologia Partite
                            </h1>
                            {user && (
                                <p className="user-subtitle">
                                    Ciao <strong>{user.name}</strong>, ecco le tue partite precedenti!
                                </p>
                            )}
                        </div>

                        {history.length > 0 && (
                            <div className="stats-summary">
                                <div className="stat-item">
                                    <span className="stat-number">{history.length}</span>
                                    <span className="stat-label">Partite Totali</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {history.filter(match => match.isWon).length}
                                    </span>
                                    <span className="stat-label">Vittorie</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {Math.round((history.filter(match => match.isWon).length / history.length) * 100)}%
                                    </span>
                                    <span className="stat-label">Win Rate</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* History Content */}
                    {history.length === 0 ? (
                        <div className="empty-history">
                            <div className="empty-icon">🎮</div>
                            <h3>Nessuna partita trovata</h3>
                            <p>Non hai ancora completato nessuna partita. Inizia a giocare per vedere qui la tua cronologia!</p>
                        </div>
                    ) : (
                        <div className="matches-list">
                            {history.map((match) => {
                                const { initialCards, roundCards } = separateCards(match.cards);

                                return (
                                    <Card key={match.matchId} className="match-card">
                                        <Card.Header className="match-header">
                                            <div className="match-info">
                                                <div className="match-date">
                                                    <span className="date-icon">📅</span>
                                                    {formatDate(match.createdAt)}
                                                </div>
                                                <div className="match-result">
                                                    {getResultBadge(match.isWon)}
                                                </div>
                                            </div>
                                            <div className="match-stats">
                                                <span className="cards-won">
                                                    <span className="stat-icon">🎯</span>
                                                    {match.totalCardsWon}/6 carte vinte
                                                </span>
                                            </div>
                                        </Card.Header>

                                        <Card.Body className="match-body">
                                            {/* Initial Cards */}
                                            <div className="cards-section">
                                                <h6 className="section-title">
                                                    <span className="section-icon">🃏</span>
                                                    Carte Iniziali
                                                </h6>
                                                <div className="cards-grid">
                                                    {initialCards.map((card, index) => (
                                                        <div key={`initial-${index}`} className="card-item">
                                                            <div className="card-image-container">
                                                                {/*<Image*/}
                                                                {/*    src={`http://localhost:3001/${card.image}`}*/}
                                                                {/*    alt={card.name}*/}
                                                                {/*    fluid*/}
                                                                {/*    rounded*/}
                                                                {/*    className="mb-2 card-image"*/}
                                                                {/*    style={{ maxHeight: '100px', objectFit: 'contain' }}*/}
                                                                {/*/>*/}
                                                                <div className="card-status">
                                                                    {getCardStatusIcon(card.isWon)}
                                                                </div>
                                                            </div>
                                                            <div className="card-info">
                                                                <br/>
                                                                <p className="card-name">{card.name}</p>
                                                                <small className="card-index">
                                                                    {/*<Badge>*/}
                                                                    {/*    Indice di sfortuna: {card.cIndex}*/}
                                                                    {/*</Badge>*/}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Round Cards */}
                                            {roundCards.length > 0 && (
                                                <div className="cards-section">
                                                    <h6 className="section-title">
                                                        <span className="section-icon">🎲</span>
                                                        Carte dei Round
                                                    </h6>
                                                    <div className="cards-grid">
                                                        {roundCards.map((card) => (
                                                            <div key={`round-${card.roundNumber}`} className="card-item">
                                                                <div className="card-image-container">
                                                                    {/*<Image*/}
                                                                    {/*    src={`http://localhost:3001/${card.image}`}*/}
                                                                    {/*    alt={card.name}*/}
                                                                    {/*    fluid*/}
                                                                    {/*    rounded*/}
                                                                    {/*    className="mb-2 card-image"*/}
                                                                    {/*    style={{ maxHeight: '100px', objectFit: 'contain' }}*/}
                                                                    {/*/>*/}
                                                                    <div className="card-status">
                                                                        {getCardStatusIcon(card.isWon)}
                                                                    </div>
                                                                    <Badge
                                                                        bg="info"
                                                                        className="round-badge"
                                                                    >
                                                                        Round {card.roundNumber+1}
                                                                    </Badge>
                                                                </div>
                                                                <div className="card-info">
                                                                    <br/>
                                                                    <p className="card-name">{card.name}</p>
                                                                    <small className="card-index">
                                                                    {/*<Badge>*/}
                                                                    {/*    Indice di sfortuna: {card.cIndex}*/}
                                                                    {/*</Badge>*/}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ProfileHistory;