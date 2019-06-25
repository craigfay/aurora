const { HttpServer, HttpResponse, Cookie } = require('../../_core/dist/main')
const { authenticate } = require('./routes/authenticate')
const { handleLogin } = require('./routes/login');
const { getUsers } = require('./routes/get-users');

function contextualizeCookie(request, context) {
  context.cookie = Cookie.parse(request.headers.cookie);
}

const s = new HttpServer({ port: 4000 });
// s.route('ALL', '/*', contextualizeCookie);
// s.route('ALL', '/*', authenticate);
// s.route('GET', '/login', handleLogin);
s.route('GET', '/users', getUsers);
s.route('GET', '/*', (req, meta) => {
  console.log(req.url)
  return new HttpResponse({ body: 'Hello!' });
});

s.listen();
