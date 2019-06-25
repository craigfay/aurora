const knex = require('../db/connection');

module.exports = { userRetrieval };

async function userRetrieval() {
  return await knex('users').select('*');
}

// function getSingleUser(id) {
//   return knex('users')
//   .select('*')
//   .where({ id: parseInt(id) });
// }

// function addUser(user) {
//   const salt = bcrypt.genSaltSync();
//   const hash = bcrypt.hashSync(user.password, salt);
//   return knex('users')
//   .insert({
//     username: user.username,
//     password: hash,
//   })
//   .returning('*');
// }
