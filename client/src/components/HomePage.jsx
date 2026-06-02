import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import '../styles/HomePage.css';

const HomePage = ({ loggedIn, user }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleDemo = () => {
        navigate('/demo');
    };

    const handlePlay = () => {
        navigate('/game');
    };

    return (
        <div className="homepage-container">
            {/* Background */}
            <div className="background-pattern"></div>

            {/* Main content */}
            <div className="homepage-content">
                <Container>
                    <Row className="min-vh-100 justify-content-center align-items-center">
                        <Col xs={12} sm={11} md={10} lg={9} xl={10}>
                            <div className="main-card">
                                {/* Header with emoji */}
                                <div className="header-section">
                                    <div className="emoji-container">
                                        <span className="emoji bounce-1">⚡</span>
                                        <span className="emoji bounce-2">🎲</span>
                                        <span className="emoji bounce-3">💥</span>
                                    </div>
                                    <h1 className="game-title">
                                        Gioco dei  <span className="highlight">Treni</span>
                                    </h1>
                                    {loggedIn && user && (
                                        <div className="welcome-message">
                                            <p className="user-welcome">
                                                👋 Ciao <strong>{user.name}</strong>!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="description-section">
                                    <p className="game-description">
                                        {loggedIn ? (
                                            <>Sei pronto per una nuova <strong>sfida</strong>?
                                            Le tue partite precedenti ti hanno preparato per questo momento!</>
                                        ) : (
                                            <>Sei pronto ad affrontare un <strong>nuovo giro</strong>?
                                            </>
                                        )}
                                    </p>

                                    <div className="features-list">
                                        {!loggedIn && (
                                        <div className="feature-item">
                                            <span className="feature-icon">🎯</span>
                                            <span>Sfida il tuo intuito</span>
                                        </div>
                                        )}
                                        <div className="feature-item">
                                            <span className="feature-icon">⏱️</span>
                                            <span>30 secondi per decidere</span>
                                        </div>
                                        <div className="feature-item">
                                            <span className="feature-icon">🏆</span>
                                            <span>Colleziona 6 carte per vincere</span>
                                        </div>
                                        {loggedIn && (
                                            <div className="feature-item">
                                                <span className="feature-icon">📊</span>
                                                <span>Traccia i tuoi progressi</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Main buttons */}
                                <div className="action-section">
                                    {loggedIn ? (
                                        // Logged user: show play button
                                        <Button
                                            className="play-btn"
                                            size="lg"
                                            onClick={handlePlay}
                                        >
                                            <span className="btn-icon">🎮</span>
                                            Inizia a Giocare
                                        </Button>
                                    ) : (
                                        // Anonymous user: show login and demo
                                        <>
                                            <Button
                                                className="login-btn"
                                                size="lg"
                                                onClick={handleLogin}
                                            >
                                                <span className="btn-icon">🔐</span>
                                                Accedi e Gioca
                                            </Button>

                                            <Button
                                                className="demo-btn"
                                                size="lg"
                                                onClick={handleDemo}
                                            >
                                                <span className="btn-icon">🎮</span>
                                                Prova la Demo
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Footer  */}
                                <div className="footer-section">
                                    <small className="text-muted">
                                        {loggedIn ? (
                                            "Le tue statistiche di gioco vengono salvate automaticamente!"
                                        ) : (
                                            "Non serve registrarsi per provare la demo!"
                                        )}
                                    </small>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default HomePage;