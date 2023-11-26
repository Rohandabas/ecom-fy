const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'login'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.get('/signup', (req, res) => {
    // Display signup form (HTML form should be created for user input)
    res.send('Signup form goes here');
});

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Insert user into database
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error(err);
            // Handle the error, e.g., return an error response
            res.send('Error occurred while signing up');
        } else {
            // User successfully signed up
            res.send('User signed up successfully');
        }
    });
});

app.get('/login', (req, res) => {
    // Display login form (HTML form should be created for user input)
    res.send('Login form goes here');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Validate user credentials
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error(err);
            // Handle the error, e.g., return an error response
            res.send('Error occurred while logging in');
        } else if (result.length > 0) {
            // Valid user credentials
            res.send('Login successful');
        } else {
            // Invalid user credentials
            res.send('Invalid username or password');
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
