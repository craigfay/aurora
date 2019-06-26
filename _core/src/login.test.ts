const { HttpServer, HttpResponse, Cookie } = require('./main');

export const tests = [
  loginTest,
]

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
const db = require('../db/connection');

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
    /**
     * http/server.js
     * 
     */
    const s = new HttpServer({ port: 4000 });
    s.route('ALL', '/*', contextualizeCookie);
    s.route('GET', '/*', (req, meta) => console.log({ req, meta }));
    // @ts-ignore
    s.route('POST', '/login', login);
    // @ts-ignore
    s.route('GET', '/users', getUsers);

    s.listen();

  }
  catch (e) {
    return e;
  }
}