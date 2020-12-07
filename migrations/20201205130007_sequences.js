'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('sequences', function(table) {
    table.uuid('uuid').notNullable().primary();
    table.uuid('user_uuid').notNullable().defaultTo('819f41a0-40cc-435e-ac7d-99cb46b9d9fc').references('uuid').inTable('users').onDelete('CASCADE').index();
    table.json('tempoTrack').notNullable().defaultTo({
         "tick": [
             {
                "bar": 1,
                "beat": 1,
                "cumulativeTime": 0,
                "ticks": 0,
                "meterNumerator": 4,
                "meterDenominator": 4,
                "tempo": 120,
                "tempoBase": "quarter"
             },
             {
                "bar": 2,
                "beat": 1,
                "cumulativeTime": 2000,
                "ticks": 0,
                "meterChange": false,
                "meterNumerator": 1,
                "meterDenominator": 1,
                "tempo": null,
                "tempoBase": null,
                "tempoChange": false
             }
         ],
    });
    table.json('sequence').notNullable().defaultTo({
        "duration": {
            "bar": 2,
            "beat": 1,
            "ticks": 0
        },
        "header": {
            "author": "01c131d5-fc4d-4c4d-a97f-2617ee575bda",
            "name": "initial"
        },
        "tracks": [
            {
                "active": true,
                "collection": null,
                "device": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                "events": [
                    {
                       "id": 0,
                        "event": "9f4db083-23fa-4c1c-b7a5-ee3f57288aa7",
                        "midiChannel": 0,
                        "name": "initial patch",
                        "patch": "fake patch",
                        "time": {
                            "bar": 0,
                            "beat": 1,
                            "ticks": 0
                        } 
                    }
                    
                ],
                "id": 0,
                "image": "https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/b3773bb133b4062103d9807e45bb300c_sp.png",
                "mute": false,
                "name": "track01",
                "output": "-977315806",
                "initialPatch": null,
                "instrument": {
                    "collection": null,
                    "bank": null,
                    "patch": null
                },
                "solo": false
            }
        ]
    });
    table.string('name').notNullable().defaultTo('initial');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sequences');
};
