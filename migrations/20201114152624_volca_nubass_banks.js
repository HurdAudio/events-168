'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('volca_nubass_banks', function(table) {
    table.uuid('uuid').notNullable().primary();
    table.uuid('user_uuid').notNullable().defaultTo('819f41a0-40cc-435e-ac7d-99cb46b9d9fc').references('uuid').inTable('users').onDelete('CASCADE').index();
     table.json('banks').notNullable().defaultTo({
         "banks": [
             {
                "uuid": "8da13b97-419e-4315-bddb-20944857e11c",
                "name": "bank",
                "notes": "",
                "patches": []
             }
         ],
     });
     table.string('name').notNullable().defaultTo('initial');
     table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('volca_nubass_banks');
};
