import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import DefaultLayout from "./components/DefaultLayout.jsx";
import NavbarComponent from "./components/NavbarComponent.jsx";
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import GamePage from "./components/GamePage.jsx";
import RankingPage from "./components/RankingPage.jsx"; 
import API from "./API/API.mjs";


function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //check if user is already logged in on app start
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const userData = await API.getUserInfo();
                if (userData) {
                    setLoggedIn(true);
                    setUser(userData);
                }
            } catch (error) {
                console.log('No active session');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (credentials) => {
        try {
            const userData = await API.login(credentials);
            setLoggedIn(true);
            setUser(userData);
            setMessage({msg: "Login effettuato con successo.", type: 'success'});
            return true;
        } catch (error) {
            setMessage({ msg: "Credenziali non valide. Riprova.", type: 'danger' });
            return false;
        }
    };

    const handleLogout = async () => {
        try {
            await API.logout();
            setLoggedIn(false);
            setUser(null);
            setMessage({ msg: 'Logout effettuato con successo', type: 'info' });
            navigate('/');
        } catch (error) {
            setMessage({ msg: 'Errore durante il logout', type: 'danger' });
        }
    };

    //show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Routes>
            <Route element={
                <DefaultLayout
                    loggedIn={loggedIn}
                    handleLogout={handleLogout}
                    message={message}
                    setMessage={setMessage}
                    user={user}
                />
            }>
                {/* Rotte Ripristinate e Corrette */}
               <Route path="/" element={<HomePage loggedIn={loggedIn} user={user}/>} />
               <Route path="/login" element={<LoginPage handleLogin={handleLogin} loggedIn={loggedIn}/>} />
            
                {/* Rotta aggiunta per il Gioco (passando setMessage come prop) */}
               <Route path="/game" element={loggedIn ? <GamePage setMessage={setMessage} /> : <Navigate to="/login" />} />
               <Route path="/ranking" element={loggedIn ? <RankingPage /> : <Navigate to="/login" />} />
            
                {/* Rotta di fallback */}
                <Route path="*" element={<h2>Pagina non trovata</h2>} />
                
            </Route>
        </Routes>
          )
}

export default App