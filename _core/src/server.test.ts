import { strict as assert } from 'assert';
const { URLSearchParams } = require('url');
import { HttpServer, HttpResponse } from './server'
import * as fetch from 'node-fetch';

export const tests = [
  portZeroTest,
  defaultHeadersTest,
  handlerMetaTest,
  illegalRouteMethods,
  responseConstructor,
  requestBodyParser,
];

async function portZeroTest() {
  const description = `port 0 can be used to
  guarantee an available port`;

  try {
    const requests = new HttpServer({ port: 0 });
    await requests.listen();
    assert(requests.port());
    await requests.close();

    return true;

  } catch (e) {
    return e;
  }
}

async function defaultHeadersTest() {
  const description = `Server responses should specify certain
  headers by default`;

  try {
    // Start up an http server
    const requests = new HttpServer({ port: 0 });
    requests.route('GET', '/', (request, meta) => {
      return {
        status: 200,
        headers: {},
        body: ''
      }
    })
    await requests.listen();
    
    // Make A request to the server defined above
    const res = await fetch(`http://0.0.0.0:${requests.port()}`);
    assert.equal(res.status, 200);
    const { length } = Object.keys(res.headers.raw());
    assert.equal(length, 5);
    assert.ok(res.headers.get('date'));
    assert.equal(res.headers.get('vary'), 'Origin');
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8');
    assert.equal(res.headers.get('connection'), 'close');
    assert.equal(res.headers.get('content-length'), '0');
    await requests.close();

  } catch (e) {
    return e;
  }
}

async function handlerMetaTest() {
  const description = `Request handlers should be able 
  to set metafields that are accessible to later handlers`;

  try {
    // Start up an http server
    const requests = new HttpServer({ port: 0 });
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
    await requests.listen();
    
    // Make A request to the server defined above
    const res = await fetch(`http://0.0.0.0:${requests.port()}`);
    assert.equal(res.status, 200);
    assert.equal(await res.text(), 'Wilber didn\'t want food. He wanted love');
    await requests.close();
  }

  catch (e) {
    return e;
  }
}

async function illegalRouteMethods() {
  const description = `Registering Unsupported 
  request methods should throw an error`;

  try {
    const registerIllegalRoute = () => {
      const requests = new HttpServer({ port: 0 });
      requests.route('SAVE', '/', (request, meta) => {
        return new HttpResponse();
      })
    }

    assert.throws(registerIllegalRoute, {
      message: 'Unsupported verb "SAVE".'
    })
      
  } catch (e) {
    return e;
  }
}

async function responseConstructor() {
  const description = `The HttpResponse constructor
  can be used to validate return material, and allows
  passing only some of the required properties`;

  try {
    // Start up an http server
    const requests = new HttpServer({ port: 0 });
    requests.route('GET', '/', (request, meta) => {
      return new HttpResponse();
    })

    await requests.listen();
    await requests.close();

  } catch (e) {
    return e;
  }
}

async function requestBodyParser() {
  const description = `All parse-able request bodies
  will be type string`;

  try {
    const requests = new HttpServer({ port: 0 });
    requests.route('POST', '/', (req, meta) => {
      assert.equal(
        typeof req.body,
        'string'
      );
    })

    await requests.listen();

    // Non-Encoded
    await fetch(`http://0.0.0.0:${requests.port()}`, {
      method: 'POST',
      body: 'It\'s true, and I have to say what\'s true',
    });

    // JSON Encoded
    await fetch(`http://0.0.0.0:${requests.port()}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ name: 'wilbur' }),
    });

    // URL Encoded
    const params = new URLSearchParams();
    params.append('name', 'charlotte');
    await fetch(`http://0.0.0.0:${requests.port()}`, {
      method: 'POST',
      body: params,
    });

    await requests.close();

  } catch (e) {
    return e;
  }
}
