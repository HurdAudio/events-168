'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('volca_fm_banks').del()
    .then(function () {
      // Inserts seed entries
      return knex('volca_fm_banks').insert([
        {
          uuid: '6f25bfd6-2e08-4e9f-b725-a8e7f789663b',
          user_uuid: '01c131d5-fc4d-4c4d-a97f-2617ee575bda',
          created_at: new Date('2020-06-14 13:05:00.000 UTC'),
          updated_at: new Date('2020-06-14 13:05:00.000 UTC')
        }
      ]);
    });
};
