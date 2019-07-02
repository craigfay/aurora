import { strict as assert } from 'assert';
import { Cache } from './cache';

export const tests = [
  cacheConstructTest,
  cacheDeleteAllTest,
  cacheSetTest,
]

async function cacheConstructTest() {
  try {
    const cache = new Cache({ address: process.env.REDIS_HOST });
    assert.equal(typeof cache, 'object');
    assert.equal(cache instanceof Promise, false);
    assert(typeof cache.get == 'function');
    assert(typeof cache.set == 'function');
    assert(typeof cache.keys == 'function');
    assert(typeof cache.delete == 'function');
    assert(typeof cache.deleteAll == 'function');
    assert(typeof cache.close == 'function');
    await cache.close();
  }
  catch (e) {
    return e;
  }
}

async function cacheDeleteAllTest() {
  try {
    const cache = new Cache({ address: process.env.REDIS_HOST });
    assert(await cache.deleteAll());
    assert.deepEqual(await cache.keys(), []);
    await cache.close();
  }
  catch (e) {
    return e;
  }
}

async function cacheSetTest() {
  try {
    const cache = new Cache({ address: process.env.REDIS_HOST });

    assert(await cache.set('Time', 'Traveler'))
    assert(await cache.set('for', JSON.stringify(['it', 'will', 'be', 'convenient'])));

    assert.rejects(
      // @ts-ignore
      () => cache.set(true, 'was expounding'),
      { message: 'Argument "key" must be of type string. Received type boolean' }
    );
    assert.rejects(
      // @ts-ignore
      async () => await cache.set('a recondite matter to us', false),
      { message: 'Argument "val" must be of type string. Received type boolean' }
    );

    await cache.close();
  }
  catch (e) {
    return e;
  }
}
