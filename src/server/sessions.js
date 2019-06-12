/**
 * Implement a key -> value cache with redis to create user sessions
 */

const { createClient } = require('redis');
const { promisify } = require('util');

const client = createClient(process.env.REDIS_HOST);

client.on('error', function (err) {
  throw new Error('Cache Error: ' + err);
});

/**
 * Async versions of `get`, `set`, and `keys`
 */
module.exports = {
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client),
  keys: promisify(client.keys).bind(client),
}