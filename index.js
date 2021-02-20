const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use((req, res, next) => {
    console.log('request at', req.originalUrl);
    next();
});
app.use(express.static("public"));
app.use(cors())
app.use(express.json())

const bcrypt = require('bcrypt');
const saltRounds = 12;

const jwtSecret = 'souljaBoyTellEm1'

const { Pool } = require('pg');
const credentials = require('./db').credentials;
const pool = new Pool(credentials);

pool.on('error', (err, client) => {
    console.error('DB ERROR: unexpected error on idle client', err)
})

app.post('/login', (req, res) => {
    let { username, password } = req.body;

    pool.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username])
        .then(result => {
            if (result.rows.length === 0) {
                res.json({
                    error: true,
                    message: 'user does not exist'
                })
            } else {
                let dbPassword = result.rows[0].password;
                bcrypt.compare(password, dbPassword)
                    .then(match => {
                        const userId = result.rows[0].id;
                        const user = { username, userId }
                        const token = jwt.sign(user, jwtSecret);
                        if(match) {
                            res.json({
                                error: false,
                                token,
                                user,
                                message: 'login successful',
                            })
                        } else {
                            res.json({
                                error: true,
                                message: 'incorrect password'
                            })
                        }
                    })
            }
        })
        .catch(err => {
            console.log('ERR', err);
            res.json({
                error: true,
                message: 'server error'
            })
        })
})

app.post('/signup', (req, res) => {
    let { username, email, password } = req.body;

    pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email])
        .then(result => {
            if (result.rows.length !== 0) {
                res.json({
                    error: true,
                    message: 'username or email already in use'
                })
            } else {
                bcrypt.hash(password, saltRounds)
                    .then(hash => {
                        pool.query('INSERT INTO users(username, email, password) VALUES($1,$2,$3) RETURNING *', [username, email, hash])
                            .then(result => {
                                const user = { username, userId: result.rows[0].id };
                                const token = jwt.sign(user, jwtSecret);
                                res.json({
                                    error: false,
                                    token,
                                    user,
                                    message: 'signup successful'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.json({
                                        error: true,
                                        message: 'database error'
                                    }
                                )
                            })
                    });
            }
        })
        .catch(err => {
            console.log('ERR', err)
            res.json({
                error: true,
                message: 'server error'
            })
        })
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.listen(8080, () => {
    console.log("listening on", 8080);
});