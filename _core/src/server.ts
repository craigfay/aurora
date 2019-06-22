import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as KoaRouter from 'koa-router';
import * as cors from '@koa/cors';
import * as staticFiles from 'koa-static';

import {
  HttpServerInterface,
  HttpServerOptionsInterface,
  HttpRequestInterface,
  HttpHeadersInterface,
  HttpResponseInterface,
  HttpResponseMaterial,
  RequestHandlerType,
} from './server.types';
import { Server } from 'https';

export class HttpServer implements HttpServerInterface {
  router: any;
  options: HttpServerOptionsInterface;
  service: Server;

  constructor(options: HttpServerOptionsInterface) {
    this.options = options;
    this.router = new KoaRouter();
  }

  route(method:string, path:string, handler: RequestHandlerType) {
    const verb = method.toLowerCase();
    if ('function' !== typeof this.router[verb]) {
      throw new Error(`Unsupported verb "${method}".`);
    }
    this.router[verb](path, async (ctx, next) => {
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

  async listen() {
    const { port, staticFileDirectory } = this.options;
    const app = new Koa();

    // Required Middleware
    app.use(bodyParser());
    app.use(cors());

    // Configurable Middleware
    if (staticFileDirectory) app.use(staticFiles(staticFileDirectory));

    app.use(this.router.routes());

    this.service = await app.listen(port);
  }

  close() {
    if (this.service) {
      this.service.close();
    }
  }
}

export class HttpResponse implements HttpResponseInterface {
  status: number;
  headers: HttpHeadersInterface;
  body: string;

  constructor(options?: HttpResponseMaterial) {
    // @TODO validate
    this.status = options.status || 200;
    this.headers = options.headers || {};
    this.body = options.body || '';
  }
}

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