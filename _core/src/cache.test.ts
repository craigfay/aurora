import { strict as assert } from 'assert';
import { Cache } from './cache';

export const tests = [
  cacheConstructTest,
  cacheDeleteAllTest,
  cacheSetTest,
  cacheGetTest,
  cacheKeysTest,
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
    assert(await cache.set('', ''));

    assert.rejects(
      // @ts-ignore
      () => cache.set(true, 'was expounding'),
      { message: 'Argument "key" must be of type string. Received type boolean' }
    );
    assert.rejects(
      // @ts-ignore
      async () => await cache.set('a recondite matter', false),
      { message: 'Argument "val" must be of type string. Received type boolean' }
    );
    assert.rejects(
      // @ts-ignore
      async () => await cache.set(500, 'to us'),
      { message: 'Argument "key" must be of type string. Received type number' }
    );
    assert.rejects(
      // @ts-ignore
      () => cache.set('His pale grey eyes shone', ['and', 'twinkled']),
      { message: 'Argument "val" must be of type string. Received type object' }
    );

    await cache.close();
  }
  catch (e) {
    return e;
  }
}

async function cacheGetTest() {
  try {
    const cache = new Cache({ address: process.env.REDIS_HOST });

    assert(await cache.set('his usually pale face', 'was flushed and animated'));
    assert.equal(await cache.get('his usually pale face'),  'was flushed and animated');

    assert(await cache.set('his usually pale face', 'The fire burnt brightly'));
    assert.equal(await cache.get('his usually pale face'),  'The fire burnt brightly');

    assert(await cache.set('his usually pale face', ''));
    assert.equal(await cache.get('his usually pale face'),  '');
    
    assert.equal(await cache.get('of the incandescent lights in the lilies'), null);

    assert.rejects(
      // @ts-ignore
      () => cache.get(true),
      { message: 'Argument "key" must be of type string. Received type boolean' }
    );
    assert.rejects(
      // @ts-ignore
      async () => await cache.get(['and', 'the', 'soft', 'radiance']),
      { message: 'Argument "key" must be of type string. Received type object' }
    );
    assert.rejects(
      // @ts-ignore
      async () => await cache.get(500),
      { message: 'Argument "key" must be of type string. Received type number' }
    );

    await cache.close();
  }
  catch (e) {
    return e;
  }
}

async function cacheKeysTest() {
  try {
    const cache = new Cache({ address: process.env.REDIS_HOST });
    assert(await cache.keys() instanceof Array);
    await cache.close();
  }
  catch (e) {
    return e;
  }
}
