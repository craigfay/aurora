import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';

const app = new Koa();

export const server = {
  app,
};