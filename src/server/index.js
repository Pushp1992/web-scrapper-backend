const express = require('express');

// readng secret key from environment variable
require('dotenv').config();

// initialize Database Connection configuration
const DBConnection = require('../database');

const app = express();

const hostname = process.env.hostname;
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// invoke DBConnection
DBConnection;

app.get('/', (req, res) => {
    res.json({
        "message": "sucessfully routed to root"
    });
});

// import API routes
require('../app/routes')(app);

app.listen(PORT, hostname, () => {
    console.log(`server is listening to http://${hostname}:${PORT}`);
});
