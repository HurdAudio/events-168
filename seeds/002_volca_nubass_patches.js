'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('volca_nubass_patches').del()
    .then(function () {
      // Inserts seed entries
      return knex('volca_nubass_patches').insert([
        {
          uuid: 'fcca17ef-f6ac-4cb1-a9f5-4f04a80a8652',
          created_at: new Date('2020-06-14 13:05:00.000 UTC'),
          updated_at: new Date('2020-06-14 13:05:00.000 UTC')
        }
      ]);
    });
};
