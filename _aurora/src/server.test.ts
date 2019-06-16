import { strict as assert } from 'assert';
import { get } from 'http';
import { HttpServer } from './server'
import { promisify } from 'util';

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

function asyncBody(res) {
  return new Promise((resolve, reject) => {
    let body = '';
    res.on('data', data => body += data);
    res.on('end', () => {
      resolve(body);
    });
  })
}

async function run() {
  get('http://0.0.0.0:8000', async res => {
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['vary'], 'Origin');
    assert.equal(res.headers['some'], 'Pig');
    assert.equal(res.headers['content-type'], 'text/plain; charset=utf-8');
    assert.equal(res.headers['connection'], 'close');
    const body = await asyncBody(res);
    await assert.equal(body , 'Wilber didn\'t want food. He wanted love');
  });
}

async function requestBasicsTest() {
  await setup()
  await run();
}

requestBasicsTest();

