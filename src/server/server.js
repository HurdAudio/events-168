
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';


function Server() {
    
    dotenv.config();
    
    const port = process.env.PORT || 3041;
    
    express().use(bodyParser.json());
    express().use(bodyParser.urlencoded({
        extended: false
    }));
    express().use(express.static(path.join(__dirname, 'public')));
    express().use(express.static(path.join(__dirname, '/../', 'node_modules')));
    
    express().get('/test', (req, res, next) => {
        res.send({user: 'forbidden'});
    });
    
    express().use('*', (req, res, next) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
        });
    });
    
    express().use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    
    express().listen(port, () => {
        console.log('listening on port ', port);
        console.log('postgreSQL is lit.');
    })
}

export default Server;