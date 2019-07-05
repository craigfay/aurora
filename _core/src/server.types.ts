/**
 * Types and Interfaces that describe how an HttpServer ought to behave
 * TODO validate outgoing HttpRequests
 */

export interface HttpServerInterface {
  // route: (method, path, handler:RequestHandlerType) => void;
  // listen: () => void;
  close: () => void;
  port:() => number;
}

export interface HttpServerConstructorInterface {
  new (options: object): HttpServerInterface;
}

export interface HttpServerOptionsInterface {
  port: number;
  routes?: HttpServerRoute[];
}

export interface HttpServerRoute {
  method: string;
  path: string;
  handler: RequestHandlerType;
}

export interface HttpHeadersInterface {
  [name: string]: string;
}

export interface HttpRequestInterface {
  url: string;
  method: string;
  headers: object;
  body: string; // Eventually allow streamable object
  // Not sure if these will be included yet
  segments? : object;
  querystring?: object;
}

export interface HttpResponseInterface {
  status: number;
  headers: HttpHeadersInterface;
  body: string;
}

export interface HttpResponseMaterial {
  status?: number;
  headers?: HttpHeadersInterface;
  body?: string;
}

export type RequestHandlerType = (
  request: HttpRequestInterface,
  meta: { [key: string]: any; },
) => HttpResponseInterface | void;

