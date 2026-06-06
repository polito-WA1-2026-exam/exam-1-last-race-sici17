import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function NotFound() {
    const navigate = useNavigate();

    return (
        <Container className="text-center mt-5">
            <Row className="justify-content-center">
                <Col>
                    <h1 className="display-3">404</h1>
                    <p className="lead">Hey! La pagina che cerchi non esiste!.</p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Torna alla Home ._.
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default NotFound;