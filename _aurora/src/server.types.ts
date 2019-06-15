/**
 * Types and Interfaces that describe how an HttpServer ought to behave
 * TODO validate outgoing HttpRequests
 */

export interface HttpServerInterface {
  route: (method, path, handler:RequestHandlerType) => void;
  listen: (callback: Function) => void;
}

export interface HttpServerConstructorInterface {
  new (options: object): HttpServerInterface;
}

export interface HttpServerOptionsInterface {
  port: number;
  staticFileDirectory?: string;
}

export interface HttpHeadersInterface {
  [name: string]: string;
}

export interface HttpRequestInterface {
  url: string;
  method: string;
  headers: object;
  body: string;
  // Not sure if these will be included yet
  segments? : object;
  querystring?: object;
}

export interface HttpResponseInterface {
  status: number;
  headers: HttpHeadersInterface;
  body: string;
}

export type RequestHandlerType = (
  request: HttpRequestInterface,
  meta: object,
) => HttpResponseInterface | void;

