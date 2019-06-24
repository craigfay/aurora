import { strict as assert } from 'assert';
import { HttpServer, HttpResponse } from './server'
import * as fetch from 'node-fetch';

export const tests = [
  portZeroTest,
  defaultHeadersTest,
  handlerMetaTest,
  illegalRouteMethods,
  responseConstructor,
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
    console.error(e);
    return false;
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
    return true;
  }

  catch (e) {
    console.error(e);
    return false;
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
    console.error(e);
    return false;
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
    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}