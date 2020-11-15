'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('volca_nubass_shares', function(table) {
    table.uuid('uuid').notNullable().primary();
    table.uuid('initial_collection_uuid').notNullable();
    table.uuid('user_uuid').notNullable().defaultTo('819f41a0-40cc-435e-ac7d-99cb46b9d9fc').references('uuid').inTable('users').onDelete('CASCADE').index();
    table.json('banks').notNullable().defaultTo({
         "banks": [
             {
                "uuid": "00df48bb-3d46-4b3c-83b7-bdb669c8f7ff",
                "name": "bank",
                "notes": "",
                "patches": []
             }
         ],
    });
    table.string('name').notNullable().defaultTo('initial');
    table.text('public_description').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('volca_nubass_shares');
};
