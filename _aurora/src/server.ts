import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import * as staticFiles from 'koa-static';

export class Server {

  middleware: Array<(request:any) => any>;
  options: {
    port: number;
    staticFileDirectory?: string;
  };

  constructor(options) {
    this.middleware = [];
    this.options = options;
  }

  use(handler) {
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
      const [handle] = this.middleware;
      const response = await handle(request);
      this.adaptResponse(response, ctx);
    });

    await app.listen(port);
    if (callback) callback();
  }

  private adaptRequest(ctx) {
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

  private adaptResponse(response, ctx) {
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

// createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.write('Hello World!');
//   res.end();
// }).listen(8080);


export interface HttpDriver {
  server : HttpServer;
  response : (response : HttpResponse) => HttpResponse;
}

export interface HttpServer {
  start : () => any; handleRoutes : () => any;
}
 
export interface HttpRequest {
  url : string;
  segments : object;
  querystring: object;
  method? : string;
  headers : object;
  body : string;
  cookies : { get : any };
}

export interface HttpResponse {
  status : number;
  headers : HttpHeaders;
  body : string | object;
  cookies : object;
}

interface HttpHeaders {
  [key : string] : string;
}

export interface RequestHeaders {
  string: string;
  object: object;
}

export interface RequestBody {
  isJSON : boolean;
  string: string;
  object: object;
}

export interface HttpRequestHandler {
  (request : HttpRequest): HttpResponse | undefined;
}

export interface RouteHandlerPairs {
  [route : string]: HttpRequestHandler;
}

interface handleRoutes {
  (routeHandlers : RouteHandlerPairs ) : void;
}

interface CreateServer {
  (config:object) : any;
}

interface Response{
  (options:object) : object;
}

export interface ModuleExport {
  createServer:CreateServer;
  response:Response;
}
