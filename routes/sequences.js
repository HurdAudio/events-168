'use strict';

const express = require('express');
const knex = require('../knex');
const uuid4 = require('uuid4');

const router = express.Router();

router.get('/', (req, res, next) => {
    knex('sequences')
        .select('*')
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/byuser/:uuid', (req, res, next) => {

    knex('sequences')
        .select()
        .where('user_uuid', req.params.uuid)
        .then((feed) => {
            if (!feed) {
                return next();
            }
            res.send(feed);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/sequence/:uuid', (req, res, next) => {
    knex('sequences')
        .select()
        .where('uuid', req.params.uuid)
        .first()
        .then((feed) => {
            if (!feed) {
                return next();
            }
            res.send(feed);
        })
        .catch((err) => {
            next(err);
        });
});

router.patch('/sequence/:uuid', (req, res, next) => {
    const now = new Date();
    
    knex('sequences')
      .where('uuid', req.params.uuid)
      .update({
        tempoTrack: req.body.tempoTrack,
        sequence: req.body.sequence,
        name: req.body.name,
        updated_at: now
      }, '*')
        .then((results)=>{
           res.status(200).send(results[0]);
        })
        .catch((err) => {
          next(err);
        });
});

router.post('/sequence', (req, res, next) => {
    const uuid = uuid4();
    
    knex('sequences')
      .insert({
        uuid: uuid,
        user_uuid: req.body.user_uuid,
        tempoTrack: req.body.tempoTrack,
        sequence: req.body.sequence,
        name: req.body.name
      }, '*')
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        next(err);
      });
});

module.exports = router;