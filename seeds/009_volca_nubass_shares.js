'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('volca_nubass_shares').del()
    .then(function () {
      // Inserts seed entries
      return knex('volca_nubass_shares').insert([
        {
          uuid: 'd879f855-7f19-4e7a-a26f-54c4d8f3d135',
          initial_collection_uuid: 'bf20afb3-470d-4eea-a2a4-1c9fe873df75',
          user_uuid: '01c131d5-fc4d-4c4d-a97f-2617ee575bda',
          created_at: new Date('2020-06-14 13:05:00.000 UTC'),
          updated_at: new Date('2020-06-14 13:05:00.000 UTC')
        }
      ]);
    });
};
