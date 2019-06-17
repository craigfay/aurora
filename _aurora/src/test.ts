/**
 * Run all tests
 */

import { tests as serverTests } from './server.test'

// Time tests as they're executed
async function run(test) {
  console.time(test.name);
  const success = await test();
  console.timeEnd(test.name);
}

serverTests.forEach(test => run(test));
