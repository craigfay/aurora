import { strict as assert } from 'assert';
import { string, integer, boolean, DataShape } from './datashapes';

export const tests = [
  stringFieldCreationTest,
  stringFieldNotNullTest,
  stringFieldMinLengthTest,
  stringFieldMaxLengthTest,
  stringFieldAlphabeticalTest,
  stringFieldMustTest,
  stringFieldNumericTest,
  stringFieldChainableConstraintsTest,
  integerFieldCreationTest,
  integerFieldNotNullTest,
  integerFieldNotNegativeTest,
  integerFieldNotZeroTest,
  integerFieldRangeTest,
  integerFieldMustTest,
  integerFieldChainableConstraintsTest,
  booleanFieldCreationTest,
  booleanFieldNotNullTest,
  booleanFieldMustTest,
  booleanFieldChainableConstraintsTest,
  dataShapeCreationTest,
];

function stringFieldCreationTest() {
  const description = `string fields can be created
  and posess the expected properties`;

  try {
    let field = string('catchphrase');
    assert(field.name == 'catchphrase');
    assert(Array.isArray(field.tests));
  } catch (e) {
    return e;
  }
}

function stringFieldNotNullTest() {
  const description = `a notNull constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    let field = string('catchphrase');
    assert.doesNotThrow(() => field.test());
    
    field.notNull();
    assert.throws(
      () => field.test(),
      { message: 'catchphrase must not be null' }
    );
  } catch (e) {
    return e;
  }
}

function stringFieldMinLengthTest() {
  const description = `a minLength constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    // Without a minLength requirement, a value of any length will be accepted by the string field
    let field = string('catchphrase');
    assert.doesNotThrow(() => field.test(''));
    
    // After applying minLength constraint, the field will not accept the same value
    field.minLength(5);
    assert.throws(
      () => field.test(''),
      { message: 'catchphrase has a min length of 5' }
    );
  } catch (e) {
    return e;
  }
}

function stringFieldMaxLengthTest() {
  const description = `a maxLength constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    // Without a maxLength requirement, a value of any length will be accepted by the string field
    let field = string('catchphrase');
    assert.doesNotThrow(() => field.test('howdy partner'));
    
    // After applying maxLength constraint, the field will not accept the same value
    field.maxLength(5);
    assert.throws(
      () => field.test('howdy partner'),
      { message: 'catchphrase has a max length of 5' }
    );
  } catch (e) {
    return e;
  }
}

function stringFieldAlphabeticalTest() {
  const description = `an alphabetical constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    let field = string('catchphrase');
    assert.doesNotThrow(() => field.test('Blink 182'));
    
    field.alphabetical();
    assert.throws(
      () => field.test('Blink 182'),
      { message: 'catchphrase must only use alphabetical characters' }
    );
  } catch (e) {
    return e;
  }
}

function stringFieldNumericTest() {
  const description = `a numeric constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    let field = string('uuid');
    assert.doesNotThrow(() => field.test('Scooby Doo'));
    
    field.numeric();
    assert.throws(
      () => field.test('Scooby Doo'),
      { message: 'uuid must only use numeric characters' }
    );
  } catch (e) {
    return e;
  }
}

function stringFieldMustTest() {
  const description = `an arbitrary constraint function
  can be applied to string fields that accepts an arg, and
  can be checked with field.test()`;

  try {
    let field = string('password');
    assert.doesNotThrow(() => field.test('try_and_break_this'));

    const include = arg => (name, val) => {
      if (!val.includes(arg))
      throw new Error(`${name} must contain "${arg}"`);
    }

    field.must(include)('!');
    assert.throws(
      () => field.test('try_and_break_this'),
      { message: 'password must contain "!"' }
    );
  } catch (e) {
    return e;
  }
}

function stringFieldChainableConstraintsTest() {
  const description = `all constraints available to string
  fields are chainable`;

  try {
    assert.doesNotThrow(() => {
      let field = string('mission')
      .notNull()
      .minLength(8)
      .maxLength(32)
      .alphabetical()
      .must(x => x)
    });

  } catch (e) {
    return e;
  }
}

function integerFieldCreationTest() {
  const description = `integer fields can be created
  and posess the expected properties`;

  try {
    let field = integer('salary');
    assert(field.name == 'salary');
    assert(Array.isArray(field.tests));
  } catch (e) {
    return e;
  }
}

function integerFieldNotNullTest() {
  const description = `a notNull constraint can be
  applied to integer fields, which can be checked with
  field.test()`;

  try {
    let field = integer('months');
    assert.doesNotThrow(() => field.test());
    
    field.notNull();
    assert.throws(
      () => field.test(),
      { message: 'months must not be null' }
    );
  } catch (e) {
    return e;
  }
}

function integerFieldNotNegativeTest() {
  const description = `a notNegative constraint can be
  applied to integer fields, which can be checked with
  field.test()`;

  try {
    let field = integer('debt');
    assert.doesNotThrow(() => field.test(-5));
    
    field.notNegative();
    assert.throws(
      () => field.test(-5),
      { message: 'debt must not be negative' }
    );
  } catch (e) {
    return e;
  }
}

function integerFieldNotZeroTest() {
  const description = `a notZero constraint can be
  applied to integer fields, which can be checked with
  field.test()`;

  try {
    let field = integer('debt');
    assert.doesNotThrow(() => field.test(0));
    
    field.notZero();
    assert.throws(
      () => field.test(0),
      { message: 'debt must not be 0' }
    );
  } catch (e) {
    return e;
  }
}

function integerFieldRangeTest() {
  const description = `a range constraint can be
  applied to integer fields, which can be checked with
  field.test()`;

  try {
    let field = integer('month');
    assert.doesNotThrow(() => field.test(0));
    
    field.range([1, 12]);
    assert.throws(
      () => field.test(0),
      { message: 'month must be between 1 and 12' }
    );
  } catch (e) {
    return e;
  }
}

function integerFieldMustTest() {
  const description = `an arbitrary constraint function
  can be applied to integer fields that accepts an arg, and
  can be checked with field.test()`;

  try {
    let field = integer('repetitions');
    assert.doesNotThrow(() => field.test(7));

    const divideBy = arg => (name, val) => {
      if (val % arg != 0)
      throw new Error(`${name} must be divisible by ${arg}`);
    }
    
    field.must(divideBy)(4);
    assert.throws(
      () => field.test(7),
      { message: 'repetitions must be divisible by 4' }
    );
  } catch (e) {
    return e;
  }
}

function integerFieldChainableConstraintsTest() {
  const description = `all constraints available to integer
  fields are chainable`;

  try {
    assert.doesNotThrow(() => {
      let field = integer('goal')
      .notNull()
      .notNegative()
      .notZero()
      .must(x => x)
    });
  } catch (e) {
    return e;
  }
}

function booleanFieldCreationTest() {
  const description = `boolean fields can be created
  and posess the expected properties`;

  try {
    let field = boolean('freeShipping');
    assert(field.name == 'freeShipping');
    assert(Array.isArray(field.tests));
  } catch (e) {
    return e;
  }
}

function booleanFieldNotNullTest() {
  const description = `a notNull constraint can be
  applied to boolean fields, which can be checked with
  field.test()`;

  try {
    let field = boolean('oldEnough');
    assert.doesNotThrow(() => field.test());
    
    field.notNull();
    assert.throws(
      () => field.test(),
      { message: 'oldEnough must not be null' }
    );
  } catch (e) {
    return e;
  }
}

function booleanFieldMustTest() {
  const description = `an arbitrary constraint function
  can be applied to boolean fields that accepts an arg, and
  can be checked with field.test()`;

  try {
    let field = boolean('lucky');
    assert.doesNotThrow(() => field.test(true));

    const beTrueAnd = arg => (name, val) => {
      if (!(arg && val)) 
      throw new Error(`${name} and ${arg} are not both true`);
    }

    field.must(beTrueAnd)(false);
    assert.throws(
      () => field.test(true),
      { message: 'lucky and false are not both true' }
    );
  } catch (e) {
    return e;
  }
}

function booleanFieldChainableConstraintsTest() {
  const description = `all constraints available to boolean
  fields are chainable`;

  try {
    const andFalse = arg => (name, val) => {
      if (!(val && false))
      throw new Error(`${name} and false must both be true`);
    }

    const beTrueAnd = arg => (name, val) => {
      if (!(arg && val)) 
      throw new Error(`${name} and ${arg} are not both true`);
    }

    assert.doesNotThrow(() => {
      let field = boolean('success')
      .notNull()
      .must(andFalse)()
      .must(beTrueAnd)(true)
    });
  } catch (e) {
    return e;
  }
}

function dataShapeCreationTest() {
  const description = `Models can be created
  from a list of fields`;

  try {
    let be = arg => (name, val) => {
      if (val !== arg)
      throw new Error(`${name} must be "${arg}"`);
    }

    let cowboy = new DataShape(
      string('birthplace'),
      string('catchphrase').notNull(),
      string('firstname').minLength(1).must(be)('Juan Carlos'),
      string('lastname').maxLength(12).notNull(),
      integer('age').notNull().notNegative().notZero(),
      integer('kills').notNegative().notZero(),
    )

    assert.doesNotThrow(() => cowboy.with({
        birthplace: 'Rio Grande',
        catchphrase: 'It\'s high noon',
        firstname: 'Juan Carlos',
        lastname: 'Riviera',
        age: 46,
        kills: 4,
      })
    );

    assert.throws(
      () => cowboy.with({
        catchphrase: 'Get along lil doggy',
        firstname: 'Rattlesnake Bill',
        lastname: 'Turner',
        age: 37,
        kills: 0,
      }),
      { message: 'firstname must be "Juan Carlos"' }
    );

  } catch (e) {
    return e;
  }
}

