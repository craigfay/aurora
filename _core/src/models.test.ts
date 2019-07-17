import { strict as assert } from 'assert';
import { string, integer, Model } from './models';

export const tests = [
  stringFieldCreationTest,
  stringFieldMinLengthTest,
  stringFieldMaxLengthTest,
  stringFieldNotNullTest,
  stringFieldAlphabeticalTest,
  stringFieldConstrainTest,
  integerFieldCreationTest,
  modelCreationTest,
];

function stringFieldCreationTest() {
  const description = `string fields can be created
  and posess the expected properties`;

  try {
    let field = string('catchphrase');
    assert(field.name == 'catchphrase');
    assert(Array.isArray(field.constraints));
    assert(typeof field.minLength == 'function');
    assert(typeof field.maxLength == 'function');
    assert(typeof field.notNull == 'function');
    assert(typeof field.alphabetical == 'function');
    assert(typeof field.constrain == 'function');
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
      string('lastname').maxLength(12).notNull()
    )

    assert.doesNotThrow(() => cowboy.test({
        birthplace: 'Rio Grande',
        catchphrase: 'It\'s high noon',
        firstname: 'Juan Carlos',
        lastname: 'Riviera',
      })
    );

    assert.throws(
      () => cowboy.test({
        catchphrase: 'Get along lil doggy',
        firstname: 'Rattlesnake Bill',
        lastname: 'Turner',
      }),
      { message: 'firstname must be "Juan Carlos"' }
    );
  } catch (e) {
    return e;
  }
}

