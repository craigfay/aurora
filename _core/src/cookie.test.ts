// import * as Cookie from './cookie';
// import { strict as assert } from 'assert';
// import { HttpServer, HttpResponse } from './server'
// import * as fetch from 'node-fetch'

// export const tests = [
//   cookieStringifyTest,
//   cookieSecureTest,
//   cookieHttpOnlyTest,
//   cookieMaxAgeTest,
//   cookieDomainTest,
//   cookieSameSiteTest,
//   cookiePathTest,
//   cookieExpiresTest,
//   cookieNonStringParseTest,
//   cookieApplicationTest,
//   cookieParseTest,
//   cookieParseOptionsTest,
// ];

// async function cookieStringifyTest() {
//   const description = `Cookie shaped objects
//   can be converted to a "set-cookie" compatible value`;

//   try {
//     assert.equal(
//       Cookie.stringify(
//         { name: 'dark', value: 'spruce' },
//       ),
//       'dark=spruce'
//     );

//     assert.equal(
//       Cookie.stringify(
//         { name: 'forest', value: 'frowned' },
//         { name: 'either', value: 'side' },
//       ),
//       'forest=frowned; either=side'
//     );

//     assert.equal(
//       Cookie.stringify(
//         { name: 'forest', value: 'waterway' },
//         { name: 'trees', value: 'stripped' },
//         { name: 'recent', value: 'wind' },
//       ),
//       'forest=waterway; trees=stripped; recent=wind'
//     );

//   } catch (e) {
//     return e;
//   }
// }

// async function cookieSecureTest() {
//   const description = `The "Secure" attribute
//   should accept truthy values`;

//   try {
//     assert.equal(
//       Cookie.stringify(
//         { name: 'white', value: 'covering', secure: true },
//         { name: 'of', value: 'frost' },
//       ),
//       'white=covering; Secure; of=frost'
//     );

//   } catch (e) {
//     return e;
//   }
// }

// async function cookieHttpOnlyTest() {
//   const description = `The "httpOnly" attribute
//   should accept truthy values`;

//   try {
//     assert.equal(
//       Cookie.stringify(
//         { name: 'they', value: 'seemed', httpOnly: true },
//         { name: 'to', value: 'lean' },
//         // @ts-ignore
//         { name: 'towards', value: 'eachother', httpOnly: 'sure' },
//       ),
//       'they=seemed; HttpOnly; to=lean; towards=eachother; HttpOnly'
//     );

//   } catch (e) {
//     return e;
//   }
// }

// async function cookieMaxAgeTest() {
//   const description = `The "maxAge" attribute
//   should accept positive integer values`;

//   try {
//     assert.equal(
//       Cookie.stringify(
//         { name: 'desolation', value: 'lifeless', maxAge: 2 },
//         { name: 'without', value: 'movement' },
//       ),
//       'desolation=lifeless; Max-Age=2; without=movement'
//     );

//     assert.equal(
//       Cookie.stringify(
//         // @ts-ignore
//         { name: 'not', value: 'even', maxAge: 'non-number' },
//       ),
//       'not=even'
//     );

//     const zeroMaxAge= () => {
//       Cookie.stringify({ name: 'so', value: 'lone', maxAge: 0 })
//     }
//     const negativeMaxAge= () => {
//       Cookie.stringify({ name: 'and', value: 'cold', maxAge: -3 })
//     }
//     const decimalMaxAge= () => {
//       Cookie.stringify({ name: 'the', value: 'spirit', maxAge: .5 })
//     }

//     assert.throws(
//       zeroMaxAge,
//       { message: "Max-Age must be a positive integer" }
//     )
//     assert.throws(
//       negativeMaxAge,
//       { message: "Max-Age must be a positive integer" }
//     )
//     assert.throws(
//       decimalMaxAge,
//       { message: "Max-Age must be a positive integer" }
//     )

//   } catch (e) {
//     return e;
//   }
// }

// async function cookieDomainTest() {
//   const description = `"domain" attribute
//   should accept string values`;

//   try {
//     assert.equal(
//       Cookie.stringify(
//         { name: 'there', value: 'was', domain: 'website.com' },
//         { name: 'a', value: 'hint' },
//         { name: 'of', value: 'laughter', domain: 'service.com' },
//       ),
//       'there=was; Domain=website.com; a=hint; of=laughter; Domain=service.com'
//     );

//   } catch (e) {
//     return e;
//   }
// }

// async function cookieSameSiteTest() {
//   const description = `"sameSite" attribute
//   should accept string values`;

//   try {
//     assert.equal(
//       Cookie.stringify(
//         { name: 'but', value: 'a', sameSite: 'Strict' },
//         { name: 'laughter', value: 'that', sameSite: 'Lax' },
//       ),
//       'but=a; SameSite=Strict; laughter=that; SameSite=Lax'
//     );

//     assert.equal(
//       Cookie.stringify(
//         // @ts-ignore
//         { name: 'was', value: 'more', sameSite: 'Terrible' },
//       ),
//       'was=more; SameSite=Terrible'
//     );

//   } catch (e) {
//     return e;
//   }
// }

// async function cookiePathTest() {
//   const description = `"path" attribute
//   should accept string values`;

//   try {
//     assert.equal(
//       Cookie.stringify(
//         { name: 'than', value: 'any', path: 'sadness' },
//       ),
//       'than=any; Path=sadness'
//     );

//   } catch (e) {
//     return e;
//   }
// }

// async function cookieExpiresTest() {
//   const description = `The "expires" attribute should
//   accept both Date objects and numbers.`;

//   try {
//     assert.equal(
//       Cookie.stringify(
//         { name: 'black', value: 'ominous', expires: new Date(Date.UTC(1994, 10, 1, 17, 36))},
//       ),
//       'black=ominous; Expires=Tue, 01 Nov 1994 17:36:00 GMT'
//     );

//     assert.equal(
//       Cookie.stringify(
//         { name: 'fading', value: 'light', expires: new Date(Date.UTC(1960, 8, 6, 5, 20))},
//       ),
//       'fading=light; Expires=Tue, 06 Sep 1960 05:20:00 GMT'
//     );

//     assert.equal(
//       Cookie.stringify(
//         { name: 'vast', value: 'silence', expires: new Date(Date.UTC(2056, 2, 20, 17, 5))},
//       ),
//       'vast=silence; Expires=Mon, 20 Mar 2056 17:05:00 GMT'
//     );

//     assert(Cookie.stringify({ name: 'reigned', value: 'over', expires: 3 }));
//     assert(Cookie.stringify({ name: 'the', value: 'land', expires: -5 }));
//     assert(Cookie.stringify({ name: 'the', value: 'land', expires: 0 }));
//     assert(Cookie.stringify({ name: 'itself', value: 'was', expires: .5 }));

//   } catch (e) {
//     return e;
//   }
// }

// async function cookieNonStringParseTest() {
//   const description = `non-string cookie headers
//   return empty objects`;

//   try {
//     assert.deepEqual(
//       Cookie.parse(undefined),
//       [],
//     );

//     assert.deepEqual(
//       // @ts-ignore
//       Cookie.parse({}),
//       [],
//     );

//     assert.deepEqual(
//       // @ts-ignore
//       Cookie.parse(true),
//       [],
//     );
    
//   } catch (e) {
//     return e;
//   }
// }

// async function cookieApplicationTest() {
//   const description = `Cookie.stringify() can be
//   use to create "set-cookie" header values`;

//   try {
//     // Start up an http server
//     const requests = new HttpServer({ port: 0 });
//     requests.route('GET', '/', (request, meta) => {
//       const cookie = Cookie.stringify({
//         name: 'incommunicable', value: 'wisdom'
//       });

//       return new HttpResponse({
//         headers: { 'set-cookie': cookie }
//       });
//     });

// //     await requests.listen();

//     const res = await fetch(`http://0.0.0.0:${requests.port()}`);
//     assert.equal(res.headers.get('set-cookie'), 'incommunicable=wisdom');
//     await requests.close();

//   } catch (e) {
//     return e;
//   }
// }

// async function cookieParseTest() {
//   description: `cookies should be parsed into the same
//   shape that they're stringified in.`

//   try {
//     const material = [
//       { name: 'how', value: 'many' },
//       { name: 'dogs', value: 'we' },
//       { name: 'got', value: 'henry' },
//     ]

//     const cookie = Cookie.stringify(...material);
//     const parsed = Cookie.parse(cookie);

//     assert.deepEqual(
//       parsed,
//       material,
//     );

//   }
//   catch (e) {
//     return e;
//   }
// }

// async function cookieParseOptionsTest() {
//   description: `Cookie options should be parsed
//   to the same state that they were stringified in.`

//   try {
//     const material = [
//       { name: 'i', value: 'took', secure: true },
//       { name: 'six', value: 'fish', httpOnly: true },
//       { name: 'out', value: 'of', path: '/' },
//       { name: 'the', value: 'bag', expires: new Date(Date.UTC(1994, 10, 1, 17, 36)) },
//       { name: 'gave', value: 'one', sameSite: 'Lax' },
//       { name: 'fish', value: 'to', domain: 'onefish.short' },
//       { name: 'each', value: 'dog', maxAge: 5 },
//     ]

//     const cookie = Cookie.stringify(...material);
//     const parsed = Cookie.parse(cookie);

//     assert.deepEqual(
//       parsed,
//       material,
//     );

//   }
//   catch (e) {
//     return e;
//   }
// }
