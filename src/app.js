import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory
} from "react-router-dom";

import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Signup from "./components/Signup";
import Terms from "./components/Terms";
import ContactUs from './components/ContactUs'

// unauthenticated access only
import Home from './components/Home'
import Login from './components/Login'

// authenticated access only
import Dashboard from './components/Dashboard'

// css
import 'sanitize.css';
import './app.css';

function App() {
    // localStorage.clear();
    let [token, setToken] = useState();
    let [user, setUser] = useState();

    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('token') !== null) setToken(localStorage.getItem('token'));
        if (localStorage.getItem('user') !== null) setUser(JSON.parse(localStorage.getItem('user')));
    }, [])

    function login({ token, user }) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        history.push('/');
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken();
        setUser();
        history.replace('/');
    }

    return (
        <div id="app">
            <Header logout={logout} token={token} user={user} />
            <Switch>
                <Route exact path='/' render={() => {
                   if (!token) {
                       return (
                           <Home login={login} />
                       );
                   } else if (user !== undefined) {
                       return (
                           <Dashboard user={user} token={token} />
                       );
                   }
                }} />
                <Route path='/login'>
                    <Login login={login} />
                </Route>
                <Route exact path='/signup' render={() => {
                    if (!token) {
                        return (
                            <Signup login={login} />
                        );
                    } else if (user !== undefined) {
                        return (
                            <Dashboard user={user} token={token} />
                        );
                    }
                }} />
                <Route path='/about'>
                    <About />
                </Route>
                <Route path='/contactus'>
                    <ContactUs />
                </Route>
                <Route path='/terms'>
                    <Terms />
                </Route>
                <Route component={Error} />
            </Switch>
            <Footer />
        </div>
    )
}

ReactDOM.render(
    <Router>
        <App />
    </Router>,

    document.getElementById('root')
);
