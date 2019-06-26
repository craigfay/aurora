const knex = require('../db/connection');

module.exports = {
  userRetrieval,
};

async function userRetrieval(descriptors={}) {
  return await knex('users').select('*').where(descriptors);
}

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
