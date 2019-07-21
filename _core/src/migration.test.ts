import { strict as assert } from 'assert';
import { string, integer, Model } from './models';
import { toKnex } from './migration';

export const tests = [
  migrationFromModelsTest,
];

function migrationFromModelsTest() {
  const description = `Models can be used to
  generate a database migration`;

  try {
    const products = new Model(
      'products',
      string('name').notNull().maxLength(64),
      string('description'),
      integer('price').notNull().notNegative(),
      integer('quantity').notNegative(),
    )

    const mmyy = arg => (name, val) => {
      const [mm, yy] = val.split(/../g).map(parseInt);
      if (0 > mm || 12 < mm)
      throw new Error(`${name} must be in mmyy format`);
    }

    // Empty Constraint
    const required = arg => () => {};

    const paymentMethods = new Model(
      'paymentMethods',
      string('accountHolder').notNull().maxLength(64).constrain(required)(),
      string('cardNumber').notNull().numeric().minLength(16).maxLength(16),
      string('expirationDate').notNull().numeric().constrain(mmyy)(),
    )

    // Remove extraneous white space
    const normalize = str => str.replace(/\s+/g, ' ').trim();

    assert.equal(
      normalize(toKnex(products)),
      normalize(`db.schema.createTable('products', table => {
        table.increments();
        table.string('name', 64).notNullable();
        table.string('description');
        table.integer('price').notNullable();
        table.integer('quantity');
      )};`)
    )

    assert.equal(
      normalize(toKnex(paymentMethods)),
      normalize(`db.schema.createTable('paymentMethods', table => {
        table.increments();
        table.string('accountHolder', 64).notNullable();
        table.string('cardNumber', 16).notNullable();
        table.string('expirationDate').notNullable();
      )};`)
    )

  } catch (e) {
    return e;
  }
}