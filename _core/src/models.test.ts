import { strict as assert } from 'assert';
import { string, integer, Model } from './models';

export const tests = [
  stringFieldCreationTest,
  stringFieldNotNullTest,
  stringFieldLengthTest,
  stringFieldMinLengthTest,
  stringFieldMaxLengthTest,
  stringFieldAlphabeticalTest,
  stringFieldConstrainTest,
  stringFieldNumericTest,
  stringFieldChainableConstraintsTest,
  integerFieldCreationTest,
  integerFieldNotNegativeTest,
  integerFieldNotZeroTest,
  integerFieldRangeTest,
  integerFieldConstrainTest,
  integerFieldChainableConstraintsTest,
  modelCreationTest,
];

function stringFieldCreationTest() {
  const description = `string fields can be created
  and posess the expected properties`;

  try {
    let field = string('catchphrase');
    assert(field.name == 'catchphrase');
    assert(Array.isArray(field.constraints));
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

function stringFieldLengthTest() {
  const description = `a length constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    let field = string('year');
    assert.doesNotThrow(() => field.test('17544'));
    
    field.length(4);
    assert.throws(
      () => field.test('17544'),
      { message: 'year must be exactly 4 characters long' }
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

function stringFieldConstrainTest() {
  const description = `an arbitrary constraint function
  can be applied to string fields, which can be checked
  with field.test()`;

  try {
    let field = string('catchphrase');
    assert.doesNotThrow(() => field.test('The Eagles'));

    const noSpaces = (name, val) => {
      if (val.includes(' '))
      throw new Error(`${name} must not include spaces`);
    }
    
    field.constrain(noSpaces);
    assert.throws(
      () => field.test('The Eagles'),
      { message: 'catchphrase must not include spaces' }
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
      .constrain(x => x)
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
    assert(Array.isArray(field.constraints));
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
    
    field.range(1, 12);
    assert.throws(
      () => field.test(0),
      { message: 'month must be between 1 and 12' }
    );
  } catch (e) {
    return e;
  }
}

function integerFieldConstrainTest() {
  const description = `an arbitrary constraint function
  can be applied to integer fields, which can be checked
  with field.test()`;

  try {
    let field = integer('repetitions');
    assert.doesNotThrow(() => field.test(7));

    const divisibleByFour = (name, val) => {
      if (val % 4 != 0)
      throw new Error(`${name} must be divisible by four`);
    }
    
    field.constrain(divisibleByFour);
    assert.throws(
      () => field.test(7),
      { message: 'repetitions must be divisible by four' }
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
      .constrain(x => x)
    });
  } catch (e) {
    return e;
  }
}

function modelCreationTest() {
  const description = `Models can be created
  from a list of fields`;

  try {
    let mustBeJuanCarlos = (name, val) => {
      if (val !== 'Juan Carlos')
      throw new Error(`${name} must be "Juan Carlos"`);
    }

    let cowboy = new Model(
      string('birthplace'),
      string('catchphrase').notNull(),
      string('firstname').minLength(1).constrain(mustBeJuanCarlos),
      string('lastname').maxLength(12).notNull(),
      integer('age').notNull().notNegative().notZero(),
      integer('kills').notNegative().notZero(),
    )

    assert.doesNotThrow(() => cowboy.test({
        birthplace: 'Rio Grande',
        catchphrase: 'It\'s high noon',
        firstname: 'Juan Carlos',
        lastname: 'Riviera',
        age: 46,
        kills: 4,
      })
    );

    assert.throws(
      () => cowboy.test({
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

