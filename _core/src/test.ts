/**
 * Run all tests
 */

import { performance } from 'perf_hooks';
import { tests as serverTests } from './server.test'
import { tests as cookieTests } from './cookie.test'

// Console colors
const red = '\x1b[31m';
const green = '\x1b[32m';
const reset = '\x1b[0m';

async function runWithTimer(fn) {
  const startTime = performance.now()
  const result = await fn();
  const endTime = performance.now();
  const runTime = (endTime - startTime).toFixed(2);
  if (result instanceof Error) {
    console.error(`${fn.name}: ${runTime} ms ${red}fail${reset}`, '\n', result, '\n')
  }
  else {
    console.log(`${fn.name}: ${runTime} ms ${green}ok${reset}`); 
  }
}

serverTests.forEach(test => runWithTimer(test));
cookieTests.forEach(test => runWithTimer(test));
