// exports.up = (knex, Promise) => {

// };

// exports.down = (knex, Promise) => {

// };
exports.up = (knex, Promise) => {
  return knex.schema.createTable('permissions', (table) => {
    table.integer('user_id').references('id').inTable('users');
    table.string('permission').notNullable();
    table.unique(['user_id', 'permission']).comment('Composite Key');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('permission');
};
