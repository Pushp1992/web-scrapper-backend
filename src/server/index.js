const express = require('express');
const mwBasicAuth = require('./middleware/basic-auth');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

// readng secret key from environment variable
require('dotenv').config();

// initialize Database Connection configuration
const DBConnection = require('../database');
const { request } = require('express');

const app = express();

// Initialize sentry for early error logging and monitoring
Sentry.init({
    dsn: process.env.DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

const hostname = process.env.hostname;
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// basic api authentication
app.use(mwBasicAuth);

// invoke DBConnection
DBConnection;

app.get('/', function rootHandler(req, res) {
    if (res.statusCode !== 200) {
        throw new Error("Error while routing to '/' ");
    }
    res.send("sucessfully routed to root");
});

// fake route to test sentry config is working
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

// import API routes
require('../app/routes')(app);

app.listen(PORT, hostname, () => {
    console.log(`server is listening to http://${hostname}:${PORT}`);
});
