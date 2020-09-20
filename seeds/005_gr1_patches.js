'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('gr1_patches').del()
    .then(function () {
      // Inserts seed entries
      return knex('gr1_patches').insert([
        {
          uuid: 'b8fd0f23-2282-45a6-9959-af1cb104308b',
          created_at: new Date('2020-06-14 13:05:00.000 UTC'),
          updated_at: new Date('2020-06-14 13:05:00.000 UTC')
        }
      ]);
    });
};
