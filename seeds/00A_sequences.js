'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('sequences').del()
    .then(function () {
      // Inserts seed entries
      return knex('sequences').insert([
        {
          uuid: '2ee0869a-cbf6-433a-b3bc-81cf7ae18f66',
          user_uuid: '01c131d5-fc4d-4c4d-a97f-2617ee575bda',
          created_at: new Date('2020-12-05 13:05:00.000 UTC'),
          updated_at: new Date('2020-12-05 13:05:00.000 UTC')
        }
      ]);
    });
};
