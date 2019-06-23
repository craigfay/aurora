const { HttpServer, HttpResponse, Cookie } = require('../../_core/dist/main')
const { authenticate } = require('./handlers/authenticate')
const { handleLogin } = require('./handlers/login');

function contextualizeCookie(request, context) {
  context.cookie = Cookie.parse(request.headers.cookie);
}

const s = new HttpServer({ port: 4000 });
s.route('ALL', '/*', contextualizeCookie);
s.route('ALL', '/*', authenticate);
s.route('GET', '/login', handleLogin);
s.route('GET', '/*', (request, context) => {
  console.log('context:', context);
  return new HttpResponse({ body: 'Hello!' });
});

s.listen();
