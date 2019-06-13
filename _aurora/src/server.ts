import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import * as staticFiles from 'koa-static';

import {
  ServerInterface,
  ServerOptionsInterface,
  RequestInterface,
  ResponseInterface,
  RequestHandlerType,
} from './server.types';

export class Server implements ServerInterface {

  middleware: RequestHandlerType[];
  options: ServerOptionsInterface;

  constructor(options: ServerOptionsInterface) {
    this.middleware = [];
    this.options = options;
  }

  use(handler: RequestHandlerType) {
    this.middleware.push(handler);
  }

  async listen(callback) {

    const { port, staticFileDirectory } = this.options;
    const app = new Koa();

    // Required Middleware
    app.use(bodyParser());
    app.use(cors());

    // Configurable Middleware
    if (staticFileDirectory) app.use(staticFiles(staticFileDirectory));
    
    app.use(async ctx => {
      const request = this.adaptRequest(ctx);
      const context = {};

      for (const handler of this.middleware) {
        const response: ResponseInterface | void = await handler(request, context);
        if (response) {
          this.adaptResponse(response, ctx);
        }
      }

    });

    await app.listen(port);
    if (callback) callback();
  }

  private adaptRequest(ctx): RequestInterface {
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

  private adaptResponse(response: ResponseInterface, ctx) {
    // Status Code
    ctx.response.status = response.status;
    // Headers
    for (const [name, value] of Object.entries(response.headers)) {
      ctx.set(name, value);
    }
    // Body
    ctx.response.body = response.body;
  }
}
