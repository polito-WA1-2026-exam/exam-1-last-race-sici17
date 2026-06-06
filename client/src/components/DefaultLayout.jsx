import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import NavbarComponent from './NavbarComponent.jsx'; 
import '../styles/alert.css'; 

const DefaultLayout = (props) => {
    return (
        <>
            <NavbarComponent 
                loggedIn={props.loggedIn} 
                handleLogout={props.handleLogout} 
                user={props.user} 
            />
            
            <Container style={{ marginTop: '90px' }}> 
                {/* avvolgo con l'alert.css per gli effetti grafici */}
                <div className="alert-container">
                    {props.message && props.message.msg && (
                        <Alert 
                            variant={props.message.type} 
                            onClose={() => props.setMessage({})} 
                            dismissible
                        >
                            {props.message.msg}
                        </Alert>
                    )}
                </div>

                <Outlet />
            </Container>
        </>
    );
};

export default DefaultLayout;