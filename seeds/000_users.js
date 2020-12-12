'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          uuid: '01c131d5-fc4d-4c4d-a97f-2617ee575bda',
          email: 'devin@devinhurd.com',
          first_name: 'Devin',
          last_name: 'Hurd',
          hashed_password: '$2b$05$titE7MFS2VCGIHlCmtBx8.4LQym/PkC/Oyq3J1W3hnbOUCt/8q5GW',
          is_admin: true,
          email_confirmed: true,
          avatar_path: 'https://habits168-hurdaudio.s3.amazonaws.com/avatars/lovecraftAvatar.jpg',
          associates: {
            "friends": [],
            "following": []
          },
          security: {
            "key": "nYeYs~_OHOXrL_XZ8IK3i8",
            "value": "PFIQefgqVYZPdaJcy09nVT",
            "onetime_key": "_1~fx8O0tqQ446vp_1L3aF",
            "salt": "3FI8e~gqVY_PdaJcy09EVT",
            "inversion": '_'
          },
          email_reset: {},
          created_at: new Date('2019-06-01 17:21:00.000 UTC'),
          updated_at: new Date('2019-06-01 17:21:00.000 UTC')
        }
      ]);
    });
};
