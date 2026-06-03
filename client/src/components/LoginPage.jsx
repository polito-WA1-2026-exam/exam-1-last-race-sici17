import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const LoginPage = ({ handleLogin, loggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //redirect if already logged in
    useEffect(() => {
        if (loggedIn) {
            navigate('/');
        }
    }, [loggedIn, navigate]);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        if (form.checkValidity()) {
            setIsLoading(true);
            setError('');

            const success = await handleLogin({ username:email, password });

            if (success) {
                navigate('/');
            } else {
                setIsLoading(false);
            }
        }
    };

    const handleDemoClick = () => {
        navigate('/demo');
    };

    const handleBackHome = () => {
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-background"></div>

            <Container className="login-content">
                <Row className="min-vh-100 justify-content-center align-items-center">
                    <Col >
                        <div className="login-card">
                            {/* Header */}
                            <div className="login-header">
                                <div className="login-emoji">🔐</div>
                                <h2 className="login-title">Accedi</h2>
                                <p className="login-subtitle">
                                    Inizia il tuo giro!
                                </p>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    <strong>Errore:</strong> {error}
                                </Alert>
                            )}

                            {/* Login Form */}
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Inserisci la tua email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="login-input"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Inserisci un'email valida.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Inserisci la tua password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={3}
                                        className="login-input"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        La password deve essere di almeno 3 caratteri.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    size="lg"
                                    disabled={isLoading}
                                    className="login-btn w-100 mb-3"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                                            Accesso in corso...
                                        </>
                                    ) : (
                                        <>
                                            <span className="btn-icon">🚀</span>
                                            Accedi
                                        </>
                                    )}
                                </Button>
                            </Form>


                            {/* Back to Home */}
                            <div className="back-section">
                                <Button
                                    variant="link"
                                    onClick={handleBackHome}
                                    className="back-btn"
                                >
                                    ← Torna alla Home
                                </Button>
                            </div>

                            {/* Test Credentials Info */}
                            <div className="test-info">
                                <small className="text-muted">
                                    <strong>Account di test:</strong><br/>
                                    Email: pasq@gmail.com<br/>
                                    Password: password
                                </small>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginPage;