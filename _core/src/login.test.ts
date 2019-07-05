// const assert = require('assert').strict;
// const fetch = require('node-fetch');

// const {
//   HttpServer,
//   HttpResponse,
//   Cookie,
//   Cache,
// } = require('./main');

// export const tests = [
//   loginTest,
// ]


// /**
//  * db/connection.js
//  */
// const dbConfig = {
//   test: {
//     client: 'pg',
//     connection: process.env.TEST_DB_HOST,
//   }
// };

// const db = require('knex')(dbConfig.test)


// /**
//  * Users Migration
//  */
// const usersMigration = {
//   up: async db => {
//     return db.schema.createTable('users', (table) => {
//       table.increments();
//       table.string('username').unique().notNullable();
//       table.string('password').notNullable();
//     });
//   },
//   down: async db => {
//     return db.schema.dropTableIfExists('users');
//   }
// }

// /**
//  * Users Seed
//  */
// const usersSeed = async db => {
//   await db('users').del()
//   await db('users').insert({
//     username: 'jeremy',
//     password: 'somepass',
//   })
//   await db('users').insert({
//     username: 'hank',
//     password: 'othrpass',
//   })
// };

// /**
//  * cache/connection.js
//  */
// const cache = new Cache({ address: process.env.CACHE_HOST });

// /**
//  * /services/user-retrieval.js
//  */
// async function userRetrieval(descriptors={}) {
//   return await db('users').select('*').where(descriptors);
// }

// /**
//  * services/session-creation.js
//  */
// import * as crypto from 'crypto';

// async function sessionCreation(key) {
//   let sessionId = crypto.randomBytes(32).toString("hex");
//   if ('OK' == await cache.set(sessionId, key)) return sessionId;
// }


// /**
//  * routes/get-users.js
//  */
// async function getUsers(req, meta) {
//   const json = JSON.stringify(await userRetrieval());
//   return new HttpResponse({ body: json });
// }

// /**
//  * http/routes/login.js
//  */
// async function login(req, meta) {
//   try {
    
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return new HttpResponse({ status: 400, body: 'Invalid Request' });
//     }
    
//     const [user] = await userRetrieval({ username, password });
    
//     if (!user) {
//       return new HttpResponse({
//         status: 400,
//         body: 'Invalid Credentials'
//       });
//     }

//     const sessionId = await sessionCreation(username);

//     if (sessionId) {
//       const cookie = Cookie.stringify({ name: 'sessionId', value: sessionId });
//       return new HttpResponse({
//         headers: { 'set-cookie': cookie },
//         body: 'Login Successful'
//       });
//     }
//   }

//   catch (e) {
//     return new HttpResponse({ status: 500, body: 'Internal Server Error' });
//   }
// }

// function contextualizeCookie(req, meta) {
//   meta.cookie = Cookie.parse(req.headers.cookie);
// }

// async function loginTest() {
//   try {
//     await usersMigration.down(db);
//     await usersMigration.up(db);
//     await usersSeed(db);

//     /**
//      * http/server.js
//      */
//     const requests = new HttpServer({ port: 0 });
//     requests.route('ALL', '/*', contextualizeCookie);
//     requests.route('POST', '/login', login);
//     requests.route('GET', '/users', getUsers);

// //     await requests.listen();

//     const getUsersResponse = await fetch(`http://0.0.0.0:${requests.port()}/users`);
//     assert.deepEqual(
//       await getUsersResponse.json(),
//       [
//         { id: 1, username: 'jeremy', password: 'somepass' },
//         { id: 2, username: 'hank', password: 'othrpass' },
//       ],
//     );

//     await requests.close();
//     await db.destroy();
//     await cache.close();
//   }
//   catch (e) {
//     return e;
//   }
// }