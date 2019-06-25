
exports.seed = (knex, Promise) => {
  return knex('users').del()
  .then(() => {
    return Promise.join(
      knex('users').insert({
        username: 'jeremy',
        password: 'somepass',
      })
    );
  })
  .then(() => {
    return Promise.join(
      knex('users').insert({
        username: 'hank',
        password: 'othrpass',
      })
    );
  });
};