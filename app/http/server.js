const { HttpServer, HttpResponse } = require('../../_core/dist/main')

const s = new HttpServer({ port: 4000 });
s.route('GET', '/*', (request) => {
  console.log('Getting a request ... \n', request);
  return new HttpResponse({ body: 'Hello!' });
});

s.listen();
