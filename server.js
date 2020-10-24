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
const volca_drum_patches = require('./routes/volca_drum_patches.js');
const midi_manager_patches = require('./routes/midi_manager_patches.js');
const gr1_patches = require('./routes/gr1_patches.js');
const volca_fm_banks = require('./routes/volca_fm_banks.js');
const volca_fm_shares = require('./routes/volca_fm_shares.js');

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
app.use('/volca_drum_patches', volca_drum_patches);
app.use('/midi_manager_patches', midi_manager_patches);
app.use('/gr1_patches', gr1_patches);
app.use('/volca_fm_banks', volca_fm_banks);
app.use('/volca_fm_shares', volca_fm_shares);

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
