const { Server } = require('../_aurora/dist/server');

const port = 8000;

const s = new Server({ port });

s.route('meh', '/', function(request, context) {
  context.phrase = 'heeee';
})

s.route('meh', '/', function(request, context) {
  console.log(context.phrase);
  return {
    status: 200,
    headers: {'foo': 'bar'},
    body: 'why hola',
  }
})

s.listen(() => console.log('listening on', port));
