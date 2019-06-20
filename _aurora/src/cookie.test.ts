import * as Cookie from './cookie';
import { strict as assert } from 'assert';

export const tests = [
  cookieStringifyTest,
  cookieStringifyAttributesTest,
];

async function cookieStringifyTest() {
  const description = `Cookie shaped objects
  can be converted to a "set-cookie" compatible value`;

  try {
    const cookie = Cookie.stringify(
      { name: 'stomach', value: 'empty' },
      { name: 'mind', value: 'full' },
    );
    
    assert.equal(cookie, 'stomach=empty; mind=full');
    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}

async function cookieStringifyAttributesTest() {
  const description = `Attributes should be stringified
  Arbitrarily`;

  try {
    const cookie = Cookie.stringify(
      { name: 'not', value: 'afraid', secure: true },
      { name: 'learning', value: 'sail' },
    );
    
    assert.equal(cookie, 'not=afraid; secure; learning=sail');
    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}
