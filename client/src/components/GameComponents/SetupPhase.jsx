import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const SetupPhase = ({ network, onStartGame }) => {
    
    // Funzione helper per trovare i nomi delle stazioni di una specifica linea
    const getStationsForLine = (lineId) => {
        const stationIds = new Set();
        
        // 1. Troviamo tutti i collegamenti (connections) che appartengono a questa linea
        network.connections.forEach(conn => {
            if (conn.line_id === lineId) {
                stationIds.add(conn.station_a_id);
                stationIds.add(conn.station_b_id);
            }
        });

        // 2. Mappiamo gli ID trovati nei veri nomi delle stazioni
        return Array.from(stationIds).map(id => {
            const station = network.stations.find(s => s.id === id);
            return station ? station.name : 'Stazione Sconosciuta';
        });
    };

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
                        {network.lines && network.lines.map((line, idx) => {
                            // Calcoliamo le stazioni per questa linea ad ogni iterazione
                            const lineStations = getStationsForLine(line.id);

                            return (
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
                                                {/* Usiamo l'array calcolato al posto di line.stations */}
                                                {lineStations.map((stationName, sIdx) => (
                                                    <React.Fragment key={sIdx}>
                                                        <div className="p-2 border rounded bg-white my-1 w-100 text-center fw-semibold text-dark shadow-sm">
                                                            {stationName}
                                                        </div>
                                                        {sIdx < lineStations.length - 1 && (
                                                            <div className="text-muted my-1" style={{ fontSize: '1.2rem' }}>↓</div>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SetupPhase;