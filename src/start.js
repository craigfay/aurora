const { HttpServer } = require('../_aurora/dist/server');

const port = 8000;
const requests = new HttpServer({ port });

requests.route('GET', '/', (request, meta) => {
  meta.greeting = 'hello';
})

requests.route('GET', '/', (request, meta) => {
  return {
    status: 200,
    headers: { 'foo': 'bar' },
    body: 'why, ' + meta.greeting,
  }
})

requests.listen(() => console.log('listening for requests on', port));
