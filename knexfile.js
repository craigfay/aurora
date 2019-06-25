const path = require('path');

const BASE_PATH = path.join(__dirname, 'app', 'db');

module.exports = {
  test: {
    client: 'pg',
    connection: process.env.TEST_DB_HOST,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: process.env.DB_HOST,
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
};

