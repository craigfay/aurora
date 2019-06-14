/**
 * Types and Interfaces that describe how an HTTP Server ought to behave
 */

export interface ServerInterface {
  route: (method, path, handler:RequestHandlerType) => void;
  listen: (callback: Function) => void;
}

export interface ServerConstructorInterface {
  new (options: object): ServerInterface;
}

export interface ServerOptionsInterface {
  port: number;
  staticFileDirectory?: string;
}

export interface HeadersInterface {
  [name: string]: string;
}

export interface RequestInterface {
  url: string;
  method: string;
  headers: object;
  body: string;
  // Not sure if these will be included yet
  segments? : object;
  querystring?: object;
}

export interface ResponseInterface {
  status: number;
  headers: HeadersInterface;
  body: string;
}

export type RequestHandlerType = (request: RequestInterface, context: object) => ResponseInterface | void;