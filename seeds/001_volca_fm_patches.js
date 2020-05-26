'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('volca_fm_patches').del()
    .then(function () {
      // Inserts seed entries
      return knex('volca_fm_patches').insert([
        {
          uuid: '8d709ba7-db09-4b70-a429-b56d83ddcb94',
          created_at: new Date('2020-05-25 13:05:00.000 UTC'),
          updated_at: new Date('2020-05-25 13:05:00.000 UTC')
        }
      ]);
    });
};
