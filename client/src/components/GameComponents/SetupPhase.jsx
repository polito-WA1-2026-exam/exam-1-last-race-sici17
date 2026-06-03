import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const SetupPhase = ({ network, onStartGame }) => {
    return (
        <Container className="my-4">
            <Card className="shadow text-center p-4 bg-light">
                <Card.Body>
                    <h1 className="display-5 mb-3">🚇 Fase di Setup</h1>
                    <p className="lead mb-4">
                        Studia attentamente la rete metropolitana qui sotto. Memorizza le linee e le connessioni tra le stazioni. Quando cliccherai su "Inizia la Gara", le linee svaniranno e avrai solo 90 secondi per pianificare il tuo percorso!
                    </p>
                    <Button variant="success" size="lg" onClick={onStartGame} className="px-5 shadow-sm mb-4">
                        🚀 Inizia la Gara!
                    </Button>
                    
                    <hr className="my-4" />
                    
                    <h3 className="mb-4 text-secondary">🗺️ Mappa della Rete Metropolitana</h3>
                    <Row className="justify-content-center">
                        {network.lines && network.lines.map((line, idx) => (
                            <Col key={idx} xs={12} md={6} lg={4} className="mb-4">
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Header 
                                        className="text-white fw-bold" 
                                        style={{ backgroundColor: line.color || '#343a40', fontSize: '1.1rem' }}
                                    >
                                        {line.name}
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="d-flex flex-column align-items-center">
                                            {line.stations.map((station, sIdx) => (
                                                <React.Fragment key={sIdx}>
                                                    <div className="p-2 border rounded bg-white my-1 w-100 text-center fw-semibold text-dark shadow-sm">
                                                        {station}
                                                    </div>
                                                    {sIdx < line.stations.length - 1 && (
                                                        <div className="text-muted my-1" style={{ fontSize: '1.2rem' }}>↓</div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SetupPhase;