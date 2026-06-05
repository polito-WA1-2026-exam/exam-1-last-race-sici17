import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = ({ loggedIn, user }) => {
    return (
        <Container className="my-4">
            {!loggedIn ? (
                /* =====================================================================
                   VISTA UTENTE ANONIMO: Solo istruzioni, niente mappa, niente funzionalità di gioco
                   ===================================================================== */
                <Row className="justify-content-center">
                    <Col xs={12} md={10}>
                        <Card className="shadow-sm border-0 bg-light p-4">
                            <Card.Body>
                                <h1 className="display-4 text-primary mb-4 text-center">🚇 Benvenuto su Last Race!</h1>
                                <p className="lead text-center mb-5">
                                    Un avvincente gioco di pianificazione metropolitana a giocatore singolo ispirato a "Race the Rails".
                                </p>
                                
                                <h3 className="text-secondary mb-3">📋 Istruzioni del Gioco</h3>
                                <div className="bg-white p-4 rounded shadow-sm mb-4">
                                    <h5 className="text-dark fw-bold">Obiettivo del Gioco</h5>
                                    <p className="text-muted">
                                        Ad ogni partita ti verranno assegnate casualmente una stazione di partenza e una stazione di destinazione all'interno di una rete metropolitana fittizia. Il tuo obiettivo è raggiungere la destinazione accumulando il maggior numero di monete possibile. Partirai con un budget iniziale di 20 monete.
                                    </p>
                                    
                                    <h5 className="text-dark fw-bold mt-4">Le Fasi della Gara</h5>
                                    <ul className="text-muted">
                                        <li className="mb-2">
                                            <strong>1. Setup:</strong> Visualizzerai la mappa completa della rete metropolitana con tutte le stazioni, le linee colorate e le relative connessioni per poter studiare il percorso.
                                        </li>
                                        <li className="mb-2">
                                            <strong>2. Pianificazione (Planning):</strong> Quando decidi di avviare la gara, le linee svaniranno! Avrai a disposizione esattamente <strong>90 secondi</strong> per selezionare in sequenza i segmenti rimasti visibili e ricostruire a mente la tratta corretta.
                                        </li>
                                        <li className="mb-2">
                                            <strong>3. Esecuzione:</strong> Il treno si metterà in movimento. Ad ogni fermata del percorso pianificato si verificherà un imprevisto casuale (un evento positivo o negativo da -4 a +4 monete) che modificherà il tuo budget. 
                                            <br />
                                            <span className="text-danger fw-semibold">Attenzione:</span> Se il percorso inserito risulta incompleto o non valido, la fase viene saltata e perderai istantaneamente tutte le 20 monete (punteggio zero).
                                        </li>
                                        <li className="mb-2">
                                            <strong>4. Risultato:</strong> Ti verrà mostrato il punteggio finale basato sulle monete residue.
                                        </li>
                                    </ul>
                                </div>

                                <div className="text-center mt-5 p-3 bg-white rounded shadow-sm border border-warning">
                                    <h5 className="text-dark mb-3 fw-bold">Sei pronto a sfidare il tempo e scalare la classifica?</h5>
                                    <p className="text-muted small mb-3">I visitatori anonimi possono solo leggere le istruzioni. Accedi con il tuo account per giocare.</p>
                                    <Link to="/login">
                                        <Button variant="primary" size="lg" className="px-5 shadow">
                                            🔑 Accedi per Giocare
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                /* =====================================================================
                   VISTA UTENTE REGISTRATO: Dashboard con accesso completo alle funzionalità
                   ===================================================================== */
                <Row className="justify-content-center text-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="shadow p-5 border-0 bg-white">
                            <Card.Body>
                                <div className="mb-4" style={{ fontSize: '4rem' }}>🕹️</div>
                                <p className="lead text-muted mb-5">
                                    Le linee della metropolitana ti aspettano. Riuscirai a battere il tuo record personale?
                                </p>
                                
                                <div className="d-grid gap-4 mx-auto">
                                    <Link to="/game">
                                        <Button variant="success" size="lg" className="w-100 py-3 fs-5 fw-bold shadow-sm">
                                            🎮 Nuova Partita (Inizia la Gara)
                                        </Button>
                                    </Link>
                                    <Link to="/ranking">
                                        <Button variant="outline-primary" size="lg" className="w-100 py-3 fs-5 fw-bold shadow-sm">
                                            🏆 Classifica Generale
                                        </Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default HomePage;