import { strict as assert } from 'assert';
import { HttpServer } from './server'
import * as fetch from 'node-fetch';

function setup() {
  const port = 8000;
  const requests = new HttpServer({ port });
  requests.route('GET', '/', (request, meta) => {
    meta.desire = 'love';
  })
  requests.route('GET', '/', (request, meta) => {
    return {
      status: 200,
      headers: { 'Some': 'Pig' },
      body: 'Wilber didn\'t want food. He wanted ' + meta.desire,
    }
  })
  requests.listen();
}

async function run() {
  const res = await fetch('http://0.0.0.0:8000');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('vary'), 'Origin');
  assert.equal(res.headers.get('some'), 'Pig');
  assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8');
  assert.equal(res.headers.get('connection'), 'close');
  assert.equal(await res.text(), 'Wilber didn\'t want food. He wanted love');
}

async function requestBasicsTest() {
  await setup()
  await run();
}

requestBasicsTest();
