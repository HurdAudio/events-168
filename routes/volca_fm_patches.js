'use strict';

const express = require('express');
const knex = require('../knex');
const uuid4 = require('uuid4');

const router = express.Router();

router.get('/', (req, res, next) => {
    knex('volca_fm_patches')
        .select('*')
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/byuser/:uuid', (req, res, next) => {

    knex('volca_fm_patches')
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
    knex('volca_fm_patches')
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
    
    knex('volca_fm_patches')
      .where('uuid', req.params.uuid)
      .update({
        patch_name: req.body.patch_name,
        algorithm: req.body.algorithm,
        settings: req.body.settings,
        lfo: req.body.lfo,
        pitch_envelope: req.body.pitch_envelope,
        global: req.body.global,
        performance: req.body.performance,
        operatorParams: req.body.operatorParams,
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
    
    knex('volca_fm_patches')
      .insert({
        uuid: uuid,
        user_uuid: req.body.user_uuid,
        patch_name: req.body.patch_name,
        algorithm: req.body.algorithm,
        settings: req.body.settings,
        lfo: req.body.lfo,
        pitch_envelope: req.body.pitch_envelope,
        global: req.body.global,
        performance: req.body.performance,
        operatorParams: req.body.operatorParams
      }, '*')
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        next(err);
      });
});

router.delete('/:uuid', (req, res, next) => {
    let record;
    
      knex('volca_fm_patches')
        .where('uuid', req.params.uuid)
        .first()
        .then((row) => {
          if (!row) {
            return next();
          }
          record = row;
          return knex('volca_fm_patches')
            .del()
            .where('uuid', req.params.uuid);
        })
        .then(() => {
          var holder = record.uuid;
          delete record.uuid;
          var obj = {
            id: holder,
            volca_fm_patches: record.volca_fm_patches,
            patch_name: record.patch_name,
            algorithm: record.algorithm,
            settings: record.settings,
            lfo: req.body.lfo,
            pitch_envelope: record.pitch_envelope,
            global: record.global,
            performance: record.performance,
            operatorParams: record.operatorParams,
            created_at: record.created_at,
            updated_at: record.updated_at
          };

          res.send({deleted: req.params.uuid});
        })
        .catch((err) => {
          next(err);
        });
    });

module.exports = router;