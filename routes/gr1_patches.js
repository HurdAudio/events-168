'use strict';

const express = require('express');
const knex = require('../knex');
const uuid4 = require('uuid4');

const router = express.Router();

router.get('/', (req, res, next) => {
    knex('gr1_patches')
        .select('*')
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/byuser/:uuid', (req, res, next) => {

    knex('gr1_patches')
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

router.get('/patch/:uuid', (req, res, next) => {
    knex('gr1_patches')
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

router.patch('/patch/:uuid', (req, res, next) => {
    const now = new Date();
    
    knex('gr1_patches')
      .where('uuid', req.params.uuid)
      .update({
        globalParams: req.body.globalParams,
        gr1Parameters: req.body.gr1Parameters,
        updated_at: now
      }, '*')
        .then((results)=>{
           res.status(200).send(results[0]);
        })
        .catch((err) => {
          next(err);
        });
});

router.post('/patch', (req, res, next) => {
    const uuid = uuid4();
    
    knex('gr1_patches')
      .insert({
        uuid: uuid,
        globalParams: req.body.globalParams,
        user_uuid: req.body.user_uuid,
        gr1Parameters: req.body.gr1Parameters
      }, '*')
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        next(err);
      });
});

module.exports = router;