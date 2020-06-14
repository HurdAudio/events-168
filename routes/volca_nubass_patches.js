'use strict';

const express = require('express');
const knex = require('../knex');
const uuid4 = require('uuid4');

const router = express.Router();

router.get('/', (req, res, next) => {
    knex('volca_nubass_patches')
        .select('*')
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/byuser/:uuid', (req, res, next) => {

    knex('volca_nubass_patches')
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
    knex('volca_nubass_patches')
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
    
    knex('volca_nubass_patches')
      .where('uuid', req.params.uuid)
      .update({
        nubass_parameters: req.body.nubass_parameters,
        nubass_faceplate_params: req.body.nubass_faceplate_params,
        global_params: req.body.global_params,
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
    
    knex('volca_nubass_patches')
      .insert({
        uuid: uuid,
        user_uuid: req.body.user_uuid,
        nubass_parameters: req.body.nubass_parameters,
        nubass_faceplate_params: req.body.nubass_faceplate_params,
        global_params: req.body.global_params
      }, '*')
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        next(err);
      });
});

module.exports = router;