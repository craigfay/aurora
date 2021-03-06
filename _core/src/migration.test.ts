import { strict as assert } from 'assert';
import { string, integer, DataShape } from './datashapes';
import { toKnex } from './migration';

export const tests = [
  migrationFromModelsTest,
];

// Remove extraneous white space
const normalize = str => str.replace(/\s+/g, ' ').trim();

function migrationFromModelsTest() {
  const description = `Models can be used to
  generate a database migration`;

  try {
    /**
     * Although effect-less during DataShape.test()
     * these functions will set properties on field.constraints
     * that can be checked later by the code that creates table definition
     */
    const unique = arg => (name, val) => {
      // ...
    };
    const references = arg => (name, val) => {
      // ...
    };

    const products = new DataShape(
      string('name').notNull().maxLength(64),
      string('description'),
      integer('price').notNull().notNegative(),
      integer('quantity').notNegative(),
    )

    const paymentMethods = new DataShape(
      integer('customerId').notNull().must(references)('customers.id'),
      string('cardNumber').notNull().numeric().minLength(16).maxLength(16),
      string('expirationDate').notNull().numeric(),
    )

    const customers = new DataShape(
      string('first').alphabetical().notNull().maxLength(32),
      string('last').notNull().alphabetical().maxLength(32),
      string('email').notNull(),
    )

    // Another way to add knex specific constraints
    customers.fields.email.constraints.unique = true;

    assert.equal(
      normalize(toKnex(products, 'products')),
      normalize(`db.schema.createTable('products', table => {
        table.increments();
        table.string('name', 64).notNullable();
        table.string('description');
        table.integer('price').notNullable().unsigned();
        table.integer('quantity').unsigned();
      )};`)
    )

    assert.equal(
      normalize(toKnex(paymentMethods, 'paymentMethods')),
      normalize(`db.schema.createTable('paymentMethods', table => {
        table.increments();
        table.integer('customerId').notNullable().references('customers.id');
        table.string('cardNumber', 16).notNullable();
        table.string('expirationDate').notNullable();
      )};`)
    )

    assert.equal(
      normalize(toKnex(customers, 'customers')),
      normalize(`db.schema.createTable('customers', table => {
        table.increments();
        table.string('first', 32).notNullable();
        table.string('last', 32).notNullable();
        table.string('email').notNullable().unique();
      )};`)
    )

  } catch (e) {
    return e;
  }
}