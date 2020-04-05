'use strict';

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/events168_dev'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/events168_test'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
