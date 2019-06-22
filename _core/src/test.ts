/**
 * Run all tests
 */

import { tests as serverTests } from './server.test'
import { tests as cookieTests } from './cookie.test'

// Time tests as they're executed
async function run(test) {
  console.time(test.name);
  const success = await test();
  console.timeEnd(test.name);
}

serverTests.forEach(test => run(test));
cookieTests.forEach(test => run(test));
