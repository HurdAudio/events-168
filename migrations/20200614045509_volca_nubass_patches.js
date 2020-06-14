'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('volca_nubass_patches', function(table) {
    table.uuid('uuid').notNullable().primary();
    table.uuid('user_uuid').notNullable().defaultTo('01c131d5-fc4d-4c4d-a97f-2617ee575bda').references('uuid').inTable('users').onDelete('CASCADE').index();
     table.json('nubass_parameters').notNullable().defaultTo({
         "pitch": 64,
         "saturation": 0,
         "level": 12,
         "cutoff": 32,
         "peak": 0,
         "attack": 13,
         "decay": 16,
         "egInt": 32,
         "accent": 12,
         "lfoRate": 8,
         "lfoInt": 8
     });
     table.json('nubass_faceplate_params').notNullable().defaultTo({
         "vtoWave": false,
         "lfoWave": false,
         "amplitude": false,
         "pitch": false,
         "cutoff": false,
         "lfoSync": false,
         "sustain": false
     });
     table.json('global_params').notNullable().defaultTo({
         "name": "default",
         "pan": 64,
         "portamento": false,
         "portamentoTime": 0
     });
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('volca_nubass_patches');
};
