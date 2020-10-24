'use strict';

const express = require('express');
const knex = require('../knex');
const uuid4 = require('uuid4');

const router = express.Router();

router.get('/', (req, res, next) => {
    knex('volca_fm_banks')
        .select('*')
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/byuser/:uuid', (req, res, next) => {

    knex('volca_fm_banks')
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

router.get('/collection/:uuid', (req, res, next) => {
    knex('volca_fm_banks')
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

router.patch('/collection/:uuid', (req, res, next) => {
    const now = new Date();
    
    knex('volca_fm_banks')
      .where('uuid', req.params.uuid)
      .update({
        user_uuid: req.body.user_uuid,
        banks: req.body.banks,
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

router.post('/banks', (req, res, next) => {
    const uuid = uuid4();
    
    knex('volca_fm_banks')
      .insert({
        uuid: uuid,
        user_uuid: req.body.user_uuid,
        banks: req.body.banks,
        name: req.body.name
      }, '*')
      .then((result) => {
        res.status(200).send(result[0]);
      })
      .catch((err) => {
        next(err);
      });
});

router.delete('/:uuid', (req, res, next) => {
    let record;
    
      knex('volca_fm_banks')
        .where('uuid', req.params.uuid)
        .first()
        .then((row) => {
          if (!row) {
            return next();
          }
          record = row;
          return knex('volca_fm_banks')
            .del()
            .where('uuid', req.params.uuid);
        })
        .then(() => {
          var holder = record.uuid;
          delete record.uuid;
          var obj = {
            uuid: holder,
            user_uuid: record.user_uuid,
            banks: record.banks,
            name: record.name,
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