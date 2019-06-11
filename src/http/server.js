const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const { routes } = require('./routes/_routes');

const app = new Koa();
const PORT = process.env.PORT || 4000;

app.use(bodyParser());
app.use(routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;