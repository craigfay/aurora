import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as KoaRouter from 'koa-router';
import * as cors from '@koa/cors';
import * as staticFiles from 'koa-static';

import {
  ServerInterface,
  ServerOptionsInterface,
  RequestInterface,
  ResponseInterface,
  RequestHandlerType,
} from './server.types';

function adaptRequest(ctx): RequestInterface {
  const {
    method,
    url,
    headers, 
    body,
  } = ctx;
  
  return Object.freeze({
    method,
    url,
    headers,
    body,
  });
}

function adaptResponse(response: ResponseInterface, ctx) {
  // Status Code
  ctx.response.status = response.status;
  // Headers
  for (const [name, value] of Object.entries(response.headers)) {
    ctx.set(name, value);
  }
  // Body
  ctx.response.body = response.body;
}

export class Server implements ServerInterface {

  router: any;
  options: ServerOptionsInterface;

  constructor(options: ServerOptionsInterface) {
    this.options = options;
    this.router = new KoaRouter();
  }

  route(method:string, path:string, handler: RequestHandlerType) {
    this.router.get(path, async (ctx, next) => {
        const request = adaptRequest(ctx);
        const context = {};

        const response: ResponseInterface | void = await handler(request, context);
        if (response) {
          adaptResponse(response, ctx);
        } else {
          await next(ctx);
        }
    })
  }


  async listen(callback) {

    const { port, staticFileDirectory } = this.options;
    const app = new Koa();

    // Required Middleware
    app.use(bodyParser());
    app.use(cors());

    // Configurable Middleware
    if (staticFileDirectory) app.use(staticFiles(staticFileDirectory));

    app.use(this.router.routes());

    await app.listen(port);
    if (callback) callback();
  }

}
