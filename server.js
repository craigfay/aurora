'use strict';

const knex = require('knex')(process.env.DB_HOST);

async function logHeartbeat() {
  const result = await knex.select('*').from('users');
  console.log('Hey I`m still here, with results:', result);
}

// This schedules code to run on intervals
// to keep this process alive
setInterval(logHeartbeat, 3000);