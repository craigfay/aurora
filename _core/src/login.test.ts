const { HttpServer, HttpResponse, Cookie } = require('./main');
const assert = require('assert').strict;
const fetch = require('node-fetch');

export const tests = [
  loginTest,
]

/**
 * knexfile.js
 */
const path = require('path');
const BASE_PATH = path.join(__dirname, 'app', 'db');

const knexfile = {
  test: {
    client: 'pg',
    connection: process.env.TEST_DB_HOST,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: process.env.DB_HOST,
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
};

/**
 * db/connection.js
 */
const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];
const db = require('knex')(config)


/**
 * Users Migration
 */
const usersMigration = {
  up: async db => {
    return db.schema.createTable('users', (table) => {
      table.increments();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
    });
  },
  down: async db => {
    return db.schema.dropTable('users');
  }
}

/**
 * Users Seed
 */
const usersSeed = async db => {
  await db('users').del()
  await db('users').insert({
    username: 'jeremy',
    password: 'somepass',
  })
  await db('users').insert({
    username: 'hank',
    password: 'othrpass',
  })
};

/**
 * cache/connection.js
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
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const keys = promisify(client.keys).bind(client);

/**
 * /services/user-retrieval.js
 */
async function userRetrieval(descriptors={}) {
  return await db('users').select('*').where(descriptors);
}

/**
 * services/session-creation.js
 * 
 */
import * as crypto from 'crypto';

async function sessionCreation(key) {
  let sessionId = crypto.randomBytes(32).toString("hex");
  if ('OK' == await set(sessionId, key)) return sessionId;
}


/**
 * routes/get-users.js
 * 
 */

async function getUsers(req, meta) {
  const json = JSON.stringify(await userRetrieval());
  return new HttpResponse({ body: json });
}

/**
 * http/routes/login.js
 */


async function login(req, meta) {
  try {
    
    const { username, password } = req.body;
    if (!username || !password) {
      return new HttpResponse({ status: 400, body: 'Invalid Request' });
    }
    
    const [user] = await userRetrieval({ username, password });
    
    if (!user) {
      return new HttpResponse({
        status: 400,
        body: 'Invalid Credentials'
      });
    }

    const sessionId = await sessionCreation(username);

    if (sessionId) {
      const cookie = Cookie.stringify({ name: 'sessionId', value: sessionId });
      return new HttpResponse({
        headers: { 'set-cookie': cookie },
        body: 'Login Successful'
      });
    }
  }

  catch (e) {
    return new HttpResponse({ status: 500, body: 'Internal Server Error' });
  }
}

function contextualizeCookie(request, context) {
  context.cookie = Cookie.parse(request.headers.cookie);
}

async function loginTest() {
  try {
    await usersMigration.down(db);
    await usersMigration.up(db);
    await usersSeed(db);

    /**
     * http/server.js
     * 
     */
    const requests = new HttpServer({ port: 0 });
    requests.route('ALL', '/*', contextualizeCookie);
    // @ts-ignore
    requests.route('POST', '/login', login);
    // @ts-ignore
    requests.route('GET', '/users', getUsers);

    await requests.listen();

    const getUsersResponse = await fetch(`http://0.0.0.0:${requests.port()}/users`);
    assert.deepEqual(
      await getUsersResponse.json(),
      [
        { id: 1, username: 'jeremy', password: 'somepass' },
        { id: 2, username: 'hank', password: 'othrpass' },
      ],
    );

    await requests.close();
    await db.destroy();
    await client.quit();
  }
  catch (e) {
    return e;
  }
}