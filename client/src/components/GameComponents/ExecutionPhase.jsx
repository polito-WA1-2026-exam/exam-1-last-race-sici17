import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';

const ExecutionPhase = ({ events=[], onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < events.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 1500); // 1 secondo e mezzo di attesa per ogni fermata
            return () => clearTimeout(timer);
        }
    }, [currentStep, events.length]);

    return (
        <Container className="my-4">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card className="shadow-lg border-primary">
                        <Card.Header className="bg-primary text-white text-center py-3">
                            <h3 className="mb-0">🚊 Treno in Movimento...</h3>
                        </Card.Header>
                        <Card.Body className="p-4 bg-light">
                            <p className="text-muted text-center mb-4">Verifica degli imprevisti ad ogni fermata pianificata:</p>
                            
                            <div className="d-flex flex-column gap-3">
                                {events.slice(0, currentStep).map((ev, index) => {
                                    const isNegative = ev.coinChange < 0;
                                    return (
                                        <Card 
                                            key={index} 
                                            className={`shadow-sm border-2 animate__animated animate__fadeIn ${isNegative ? 'border-danger' : 'border-success'}`}
                                        >
                                            <Card.Body className="d-flex justify-content-between align-items-center py-3">
                                                <div>
                                                    <h5 className="mb-1 text-dark">🛑 Stazione: <span className="fw-bold">{ev.station}</span></h5>
                                                    <p className="mb-0 text-muted small">{ev.description}</p>
                                                </div>
                                                <Badge bg={isNegative ? "danger" : "success"} className="fs-5 px-3 py-2 shadow-sm">
                                                    {ev.coinChange > 0 ? `+${ev.coinChange}` : ev.coinChange} 🪙
                                                </Badge>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </div>

                            {currentStep < events.length && (
                                <div className="text-center mt-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Prossima stazione...</span>
                                    </div>
                                    <p className="text-primary mt-2 fw-semibold">Il treno sta per giungere alla prossima stazione...</p>
                                </div>
                            )}

                            {currentStep >= events.length && (
                                <div className="text-center mt-5">
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="px-5 shadow"
                                        onClick={onComplete}
                                    >
                                        🏁 Scopri il Risultato Finale
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ExecutionPhase;