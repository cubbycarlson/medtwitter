import React, { useState } from 'react';
import url from '../../url.js'

import './login.css';

export default function Index({ login }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    return (
        <div className="formContainer">
            <h2 className="formHeader">LOGIN</h2>
            <form className="formForm" onSubmit={e => {
                e.preventDefault();
                setLoginMessage('');
                fetch(url + '/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                    .then(res => res.json())
                    .then(json => {
                        let { error, message, token, user } = json;

                        if (!error) {
                            login({ user, token })
                        } else {
                            setLoginMessage(message);
                        }
                    })
                    .catch(err => console.log(err));
            }}>
                <label className="formLabel">Username/Email:</label>
                <input className="formInput" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                <label className="formLabel">Password:</label>
                <input className="formInput" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <input className="formSubmit" type="submit" value="submit" />
                <p className="formMessage">{loginMessage}</p>
            </form>
        </div>
    )
}