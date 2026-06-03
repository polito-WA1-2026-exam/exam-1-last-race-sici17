import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import NavbarComponent from './NavbarComponent.jsx'; // <-- Assicurati che l'import sia corretto

const DefaultLayout = (props) => {
    return (
        <>
            {/* La Navbar DEVE essere inserita qui dentro, prima del Container */}
            <NavbarComponent 
                loggedIn={props.loggedIn} 
                handleLogout={props.handleLogout} 
                user={props.user} 
            />
            
            {/* Aggiungiamo il margine per non far finire i contenuti sotto la navbar fissa */}
            <Container style={{ marginTop: '90px' }}> 
                {props.message && props.message.msg && (
                    <Alert variant={props.message.type} onClose={() => props.setMessage({})} dismissible>
                        {props.message.msg}
                    </Alert>
                )}

                {/* Qui vengono renderizzate le sotto-pagine (Home, Login, ecc.) */}
                <Outlet />
            </Container>
        </>
    );
};

export default DefaultLayout;