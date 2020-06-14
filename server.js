'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
//const bcrypt = require('bcrypt');
const request = require('request');

require('dotenv').config();

const app = express();

const users = require('./routes/users.js');
const volca_fm_patches = require('./routes/volca_fm_patches.js');
const volca_nubass_patches = require('./routes/volca_nubass_patches.js');

const port = process.env.PORT || 3041;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/../', 'node_modules')));

app.use('/users', users);
app.use('/volca_fm_patches', volca_fm_patches);
app.use('/volca_nubass_patches', volca_nubass_patches);

app.get('/test', (req, res, next) => {
    res.send({user: 'forbidden'});
});


app.use('*', function (req, res, next) {
    res.sendFile('home.html', {
        root: path.join(__dirname, 'public')
    });
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(port, () => {
    console.log('Listening on port', port);
    console.log('postgreSQL is lit.');
});

module.exports = app;
