'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('volca_drum_patches', function(table) {
    table.uuid('uuid').notNullable().primary();
    table.uuid('user_uuid').notNullable().defaultTo('01c131d5-fc4d-4c4d-a97f-2617ee575bda').references('uuid').inTable('users').onDelete('CASCADE').index();
     table.json('globalParams').notNullable().defaultTo({
         "bitReduction": 0,
         "name": "default",
         "overdriveGain": 0,
         "pan": 64,
         "premixGain": 64,
         "send": 55,
         "waveFolder": 0,
         "waveGuide": {
             "body": 0,
             "decay": 0,
             "tune": 0
         }
     });
     table.json('patch').notNullable().defaultTo({
         "patch": [
         {
             "layer1": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer2": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer12": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layerSelection": [true, false, false],
             "patch": 0
         },
         {
             "layer1": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer2": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer12": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layerSelection": [true, false, false],
             "patch": 0
         },
         {
             "layer1": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer2": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer12": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layerSelection": [true, false, false],
             "patch": 0
         },
         {
             "layer1": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer2": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer12": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layerSelection": [true, false, false],
             "patch": 0
         },
         {
             "layer1": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer2": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer12": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layerSelection": [true, false, false],
             "patch": 0
         },
         {
             "layer1": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer2": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layer12": {
                 "envelopeGenerator": {
                     "attack": 12,
                     "release": 27
                 },
                 "level": 100,
                 "modulation": {
                     "amount": 55,
                     "rate": 12
                 },
                 "pitch": 55,
                 "waveGuideModel": {
                     "envelopeGenerators": [true, false, false],
                     "pitchModulators": [true, false, false],
                     "soundSource": [true, false, false, false, false]
                 }
             },
             "layerSelection": [true, false, false],
             "patch": 0
         }
     ]});
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('volca_drum_patches');
};
