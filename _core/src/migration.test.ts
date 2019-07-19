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

    const mmyy = (name, val) => {
      const [mm, yy] = val.split(/../g).map(parseInt);
      if (0 > mm || 12 < mm)
      throw new Error(`${name} must be in mmyy format`);
    }

    const paymentMethods = new Model(
      'paymentMethods',
      string('accountHolder').notNull().maxLength(64),
      string('cardNumber').notNull().numeric().length(16),
      string('expirationDate').notNull().numeric().length(4).constrain(mmyy)
    )
    toKnex(products)
    toKnex(paymentMethods)
  } catch (e) {
    return e;
  }
}