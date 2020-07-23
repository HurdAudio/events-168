'use strict';

const express = require('express');
const knex = require('../knex');
const uuid4 = require('uuid4');

const router = express.Router();

router.get('/', (req, res, next) => {
    knex('midi_manager_patches')
        .select('*')
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/byuser/:uuid', (req, res, next) => {

    knex('midi_manager_patches')
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
    knex('midi_manager_patches')
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
    
    knex('midi_manager_patches')
      .where('uuid', req.params.uuid)
      .update({
        user_preset: req.body.user_preset,
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
    
    knex('midi_manager_patches')
      .insert({
        uuid: uuid,
        user_uuid: req.body.user_uuid,
        user_preset: req.body.user_preset
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
    
      knex('midi_manager_patches')
        .where('uuid', req.params.uuid)
        .first()
        .then((row) => {
          if (!row) {
            return next();
          }
          record = row;
          return knex('midi_manager_patches')
            .del()
            .where('uuid', req.params.uuid);
        })
        .then(() => {
          var holder = record.uuid;
          delete record.uuid;
          var obj = {
            uuid: holder,
            user_uuid: record.user_uuid,
            user_preset: record.user_preset,
            created_at: record.created_at,
            updated_at: record.updated_at
          };

          res.send(obj);
        })
        .catch((err) => {
          next(err);
        });
    });

module.exports = router;