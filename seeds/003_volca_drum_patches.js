'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('volca_drum_patches').del()
    .then(function () {
      // Inserts seed entries
      return knex('volca_drum_patches').insert([
        {
          uuid: '6fc762d6-7d77-4770-bd21-52749e90038f',
          created_at: new Date('2020-06-14 13:05:00.000 UTC'),
          updated_at: new Date('2020-06-14 13:05:00.000 UTC')
        }
      ]);
    });
};
