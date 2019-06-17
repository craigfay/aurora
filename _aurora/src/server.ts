import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as KoaRouter from 'koa-router';
import * as cors from '@koa/cors';
import * as staticFiles from 'koa-static';

import {
  HttpServerInterface,
  HttpServerOptionsInterface,
  HttpRequestInterface,
  HttpResponseInterface,
  RequestHandlerType,
} from './server.types';
import { Server } from 'https';

function adaptRequest(ctx): HttpRequestInterface {
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

function adaptResponse(response: HttpResponseInterface, ctx) {
  // Status Code
  ctx.response.status = response.status;
  // Headers
  for (const [name, value] of Object.entries(response.headers)) {
    ctx.set(name, value);
  }
  // Body
  ctx.response.body = response.body;
}

export class HttpServer implements HttpServerInterface {
  router: any;
  options: HttpServerOptionsInterface;
  service: Server;

  constructor(options: HttpServerOptionsInterface) {
    this.options = options;
    this.router = new KoaRouter();
  }

  route(method:string, path:string, handler: RequestHandlerType) {
    this.router.get(path, async (ctx, next) => {
        const request = adaptRequest(ctx);
        const meta = ctx._meta || {};

        const response: HttpResponseInterface | void = await handler(request, meta);
        if (response) {
          adaptResponse(response, ctx);
        } else {
          ctx._meta = meta;
          await next();
        }
    })
  }

  async listen(callback?) {
    const { port, staticFileDirectory } = this.options;
    const app = new Koa();

    // Required Middleware
    app.use(bodyParser());
    app.use(cors());

    // Configurable Middleware
    if (staticFileDirectory) app.use(staticFiles(staticFileDirectory));

    app.use(this.router.routes());

    this.service = await app.listen(port);
    if (callback) callback();
  }

  close() {
    if (this.service) {
      this.service.close();
      return true;
    }
    return false;
  }
}
