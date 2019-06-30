import { strict as assert } from 'assert';
import { Cache } from './cache';

export const tests = [
  cacheConstructTest,
]

async function cacheConstructTest() {
  try {
    const cache = new Cache({ address: process.env.REDIS_HOST });
    assert.equal(
      typeof cache,
      'object',
    )
    assert.equal(
      cache instanceof Promise,
      false,
    )
    assert(typeof cache.get == 'function');
    assert(typeof cache.set == 'function');
    assert(typeof cache.keys == 'function');
    assert(typeof cache.close == 'function');

    await cache.close();

  }
  catch (e) {
    return e;
  }
}
