const { Server } = require('../_aurora/dist/server');

const port = 8000;

const s = new Server({ port });

s.use(function(request, context) {
  context.greeting = 'hello';
});

s.use(function(request, context) {
  return {
    status: 200,
    headers: {'foo': 'bar'},
    body: 'why hello',
  }
});

s.listen(() => console.log('listening on', port));
