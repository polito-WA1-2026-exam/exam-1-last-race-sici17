import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import NavbarComponent from './NavbarComponent.jsx'; 

const DefaultLayout = (props) => {
    return (
        <>
            <NavbarComponent 
                loggedIn={props.loggedIn} 
                handleLogout={props.handleLogout} 
                user={props.user} 
            />
            
            <Container style={{ marginTop: '90px' }}> 
                {props.message && props.message.msg && (
                    <Alert variant={props.message.type} onClose={() => props.setMessage({})} dismissible>
                        {props.message.msg}
                    </Alert>
                )}

                <Outlet />
            </Container>
        </>
    );
};

export default DefaultLayout;