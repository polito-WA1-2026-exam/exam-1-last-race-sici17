import { Alert, Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router";
import NavbarComponent from "./NavbarComponent.jsx";
import "../styles/Alert.css"

function DefaultLayout(props) {
    const handleCloseAlert = () => {
        //fade out effect on alert closing
        const alertElement = document.querySelector('.alert');
        if (alertElement) {
            alertElement.classList.add('fade-out');
            setTimeout(() => {
                props.setMessage('');
            }, 300);
        } else {
            props.setMessage('');
        }
    };

    return(
        <>
            <NavbarComponent
                loggedIn={props.loggedIn}
                onLogout={props.handleLogout}
            />

            {/* Container for alerts */}
            {props.message?.msg && (
                <div className="alert-container">
                    <Container>
                        <Row className="justify-content-center">
                            <Col xs={12} md={10} lg={8}>
                                <Alert
                                    variant={props.message.type}
                                    onClose={handleCloseAlert}
                                    dismissible
                                    className="custom-alert"
                                >
                                    {props.message.msg}
                                </Alert>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}

            <div className="main-content">
                <Outlet />
            </div>
        </>
    );
}

export default DefaultLayout;