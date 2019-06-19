import * as Cookie from './cookie';
import { strict as assert } from 'assert';

export const tests = [
  cookieStringifyTest,
];

async function cookieStringifyTest() {
  const description = `Cookie shaped objects
  can be converted to a "set-cookie" compatible value`;

  try {
    const cookie = Cookie.stringify([
      { name: 'stomach', value: 'empty' },
      { name: 'mind', value: 'full' },
    ]);
    
    assert.equal(cookie, 'stomach=empty; mind=full');
    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}
