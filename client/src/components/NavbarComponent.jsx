import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = (props) => {
    const navigate = useNavigate();

    return (
        <Navbar bg="primary" variant="dark" expand="lg" fixed="top" className="shadow">
            <Container>
                <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    🚂 My Train Exam Project
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
                        {props.loggedIn && (
                            <>
                                {/* Aggiungi qui le rotte protette che ti servono (es. /something) */}
                                <Nav.Link onClick={() => navigate('/something/myparam')}>Area Privata</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {props.loggedIn ? (
                            <Button variant="outline-light" onClick={props.onLogout}>Logout</Button>
                        ) : (
                            <Button variant="outline-light" onClick={() => navigate('/login')}>Login</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;