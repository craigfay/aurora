const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const { router } = require('./routes/_router');

const app = new Koa();
const PORT = process.env.PORT || 4000;

app.use(bodyParser());
app.use(router.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;