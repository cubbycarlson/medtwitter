import React, { useState } from 'react';
import url from '../../url.js'
import {
    useHistory
} from "react-router-dom";

export default function Signup({ login }) {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [signupMessage, setSignupMessage] = useState('');

    return (
        <div className="formContainer">
            <h2 className="formHeader">Signup</h2>
            <form className="formForm" onSubmit={e => {
                e.preventDefault();
                setSignupMessage('');
                if (password !== passwordCheck) {
                    setSignupMessage('passwords do not match');
                } else {
                    fetch(url + '/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username,
                            email,
                            password
                        })
                    })
                        .then(res => res.json())
                        .then(json => {
                            let { error, message, token, user } = json;

                            if (!error) {
                                login({ user, token });
                            } else {
                                setSignupMessage(message);
                            }
                        }).catch(err => {
                            console.log(err)
                    });
                }
            }}>
                <label className="formLabel">Username:</label>
                <input className="formInput" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                <label className="formLabel">Email:</label>
                <input className="formInput" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                <label className="formLabel">Password:</label>
                <input className="formInput" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <label className="formLabel">Repeat Password:</label>
                <input className="formInput" type="password" value={passwordCheck} onChange={e => setPasswordCheck(e.target.value)} />
                <input className="formSubmit" type="submit" value="Submit" />
                <p className="formMessage">{signupMessage}</p>
            </form>
        </div>
    )
}