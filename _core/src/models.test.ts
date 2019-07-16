import { strict as assert } from 'assert';
import { string } from './models';

export const tests = [
  stringFieldCreationTest,
  stringFieldMaxLengthTest,
];

function stringFieldCreationTest() {
  const description = `string fields can be created
  and posess the expected properties`;

  try {
    let field = string('catchphrase');
    assert(field.name == 'catchphrase');
    assert(Array.isArray(field.constraints));
    assert(typeof field.maxLength == 'function');
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
