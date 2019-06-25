const { HttpServer, HttpResponse, Cookie } = require('../../_core/dist/main')
const { authenticate } = require('./routes/authenticate')
const { login } = require('./routes/login');
const { getUsers } = require('./routes/get-users');

function contextualizeCookie(request, context) {
  context.cookie = Cookie.parse(request.headers.cookie);
}

const s = new HttpServer({ port: 4000 });
s.route('ALL', '/*', contextualizeCookie);
s.route('GET', '/*', (req, meta) => console.log({ req, meta }));
// s.route('ALL', '/*', authenticate);
s.route('POST', '/login', login);
// s.route('GET', '/users', getUsers);

s.listen();
