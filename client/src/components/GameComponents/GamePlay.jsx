import React from "react";
import { Badge, Button, Card, Col, Row, ListGroup } from "react-bootstrap";
import GameTimer from "./GameTimer.jsx";
import "../../styles/GamePlay.css";

const GamePlay = (props) => {
    const { gameData, network, route, timeLeft, handleSegmentSelect, handleConfirmRoute, gameStats } = props;
    const allSegments = network.segments || [];

    return (
        <Row className="min-vh-100 align-items-center justify-content-center py-4">
            <Col xs={12} lg={5}>
                <Card className="shadow mb-4">
                    <Card.Header className="bg-primary text-white py-3">
                        <Row className="align-items-center">
                            <Col>
                                <h4 className="mb-1">📋 Obiettivo Tratta</h4>
                                <div>
                                    <Badge bg="success" className="me-2 fs-6">🪙 Budget: {gameStats.coins} monete</Badge>
                                    <Badge bg="info" className="fs-6">Tratti scelti: {gameStats.segmentsCount}</Badge>
                                </div>
                            </Col>
                            <Col xs="auto">
                                <GameTimer timeLeft={timeLeft} totalTime={90} />
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body className="p-4 bg-white">
                        <div className="text-center p-3 border rounded bg-light mb-4 shadow-sm">
                            <h6 className="text-muted mb-1">PARTENZA</h6>
                            <h4 className="text-success fw-bold mb-2">{gameData.startStation}</h4>
                            <div className="text-muted mb-2" style={{ fontSize: '1.3rem' }}>➔</div>
                            <h6 className="text-muted mb-1">DESTINAZIONE</h6>
                            <h4 className="text-danger fw-bold mb-0">{gameData.destStation}</h4>
                        </div>

                        <h5 className="mb-3 text-secondary">🛤️ Percorso Pianificato:</h5>
                        <ListGroup className="shadow-sm">
                            {route.length === 0 ? (
                                <ListGroup.Item className="text-muted text-center py-3">
                                    Nessun segmento selezionato. Clicca sulle tratte disponibili a destra per tracciare la rotta.
                                </ListGroup.Item>
                            ) : (
                                route.map((seg, idx) => (
                                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center fw-semibold">
                                        <span>{idx + 1}. {seg.from} ↔ {seg.to}</span>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            onClick={() => handleSegmentSelect(seg)}
                                        >
                                            Rimuovi
                                        </Button>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>

                        <div className="text-center mt-4">
                            <Button
                                variant={route.length === 0 ? 'outline-secondary' : 'success'}
                                onClick={handleConfirmRoute}
                                disabled={route.length === 0}
                                className="px-5 py-2 fs-5 shadow w-100"
                            >
                                🚂 Avvia il Treno e Verifica
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col xs={12} lg={7}>
                <Card className="shadow mb-4">
                    <Card.Header className="bg-primary text-white py-3">
                        <h5 className="text-center mb-0">🔀 Collegamenti Disponibili (Linee Svanite)</h5>
                    </Card.Header>
                    <Card.Body className="p-3" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                        <p className="text-muted text-center mb-3">Seleziona i segmenti per comporre la tua rotta:</p>
                        <Row className="g-2">
                            {allSegments.map((seg, idx) => {
                                const isSelected = route.some(s => s.id === seg.id);
                                return (
                                    <Col xs={12} sm={6} key={idx}>
                                        <Button
                                            variant={isSelected ? "warning" : "outline-dark"}
                                            className="w-100 py-3 text-truncate fw-semibold shadow-sm"
                                            onClick={() => handleSegmentSelect(seg)}
                                        >
                                            {isSelected ? "⭐ " : ""}{seg.from} ↔ {seg.to}
                                        </Button>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default GamePlay;