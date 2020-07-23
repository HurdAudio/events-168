'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('midi_manager_patches', function(table) {
    table.uuid('uuid').notNullable().primary();
    table.uuid('user_uuid').notNullable().defaultTo('01c131d5-fc4d-4c4d-a97f-2617ee575bda').references('uuid').inTable('users').onDelete('CASCADE').index();
    table.json('user_preset').notNullable().defaultTo({
        "inputs": [],
        "outputs": [],
        "name": 'default'
    });
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('midi_manager_patches');
};
