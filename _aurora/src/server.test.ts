import { strict as assert } from 'assert';
import { HttpServer } from './server'
import * as fetch from 'node-fetch';

async function defaultHeadersTest() {
  const description = `Server responses should specify certain
  headers by default`;

  try {
    // Start up an http server
    const port = 8000;
    const requests = new HttpServer({ port });
    requests.route('GET', '/', (request, meta) => {
      return {
        status: 200,
        headers: {},
        body: ''
      }
    })
    requests.listen();
    
    // Make A request to the server defined above
    const res = await fetch('http://0.0.0.0:8000');
    assert.equal(res.status, 200);
    const { length } = Object.keys(res.headers.raw());
    assert.equal(length, 5);
    assert.ok(res.headers.get('date'));
    assert.equal(res.headers.get('vary'), 'Origin');
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8');
    assert.equal(res.headers.get('connection'), 'close');
    assert.equal(res.headers.get('content-length'), '0');
    // Stop the server
    requests.close();
    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}

async function handlerMetaTest() {
  const description = `Request handlers should be able 
  to set metafields that are accessible to later handlers`;

  try {
    // Start up an http server
    const port = 8001;
    const requests = new HttpServer({ port });
    requests.route('GET', '/', (request, meta) => {
      meta.desire = 'love';
    })
    requests.route('GET', '/', (request, meta) => {
      return {
        status: 200,
        headers: {},
        body: 'Wilber didn\'t want food. He wanted ' + meta.desire,
      }
    })
    requests.listen();
    
    // Make A request to the server defined above
    const res = await fetch('http://0.0.0.0:8001');
    assert.equal(res.status, 200);
    assert.equal(await res.text(), 'Wilber didn\'t want food. He wanted love');
    // Stop the server
    requests.close();
    return true;
  }

  catch (e) {
    console.error(e);
    return false;
  }
}

export const tests = [
  defaultHeadersTest,
  handlerMetaTest,
];
