import React from 'react';
import Login from '../Login'

import './home.css'

export default function ({ login }) {
    return (
        <div className="homeContainer">
            <p className="primaryP">Med Twitter is a research project that collects and analyzes data about medical research and twitter.</p>
            <Login className="login" login={login} />
            <p className="secondaryP">This site is currently closed to the public. Please request a login from Cubby.</p>
        </div>
    );
}