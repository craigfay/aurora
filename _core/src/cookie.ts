import { strict as assert } from 'assert';

export interface Cookie {
  name: string;
  value: string;
  expires?: Date | number;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
}

/**
 * Parse the "Cookies" header value into a list of Cookie objects
 * @param cookies
 */
export function parse(cookies: string): object {
  const out = [];

  if (typeof cookies === 'string') {
    const c = cookies!.split(";");
    for (const kv of c) {
      const parsed:Cookie = { name: undefined, value: undefined }
      let [name, value] = kv.trim().split('=');

      if (name && value) {
        if (name == 'Expires') {
          out[out.length - 1].expires = new Date(Date.parse(value));
        }
        else if (name == 'Path') {
          out[out.length - 1].path = value;
        }
        else if (name == 'SameSite') {
          out[out.length - 1].sameSite = value;
        }
        else if (name == 'Max-Age') {
          out[out.length - 1].maxAge = Number(value);
        }
        else if (name == 'Domain') {
          out[out.length - 1].domain = value;
        }
        else {
          parsed.name = name;
          parsed.value = value;
          out.push(parsed);
          continue;
        }
      }
      
      if (name == 'Secure') {
        out[out.length - 1].secure = true;
      }
      if (name == 'HttpOnly') {
        out[out.length - 1].httpOnly = true;
      }
    }
  }
  return out;
}

/**
 * Stringify an arbitrary amount of cookie objects 
 * @param cookies
 */
export function stringify(...cookies: Cookie[]) {

  return cookies.map(cookie => {
    const value = encodeURIComponent(String(cookie.value))
      .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

    const name = encodeURIComponent(String(cookie.name))
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[\(\)]/g, escape);

    // ref: https://tools.ietf.org/html/draft-ietf-httpbis-cookie-prefixes-00#section-3.1
    if (name.startsWith("__Secure")) {
      cookie.secure = true;
    }
    if (name.startsWith("__Host")) {
      cookie.path = "/";
      cookie.secure = true;
      delete cookie.domain;
    }

    let out = [`${name}=${value}`];

    if (cookie.secure) {
      out.push("Secure");
    }
    if (cookie.httpOnly) {
      out.push("HttpOnly");
    }
    if (typeof cookie.maxAge == 'number') {
      assert(Number.isInteger(cookie.maxAge) && cookie.maxAge > 0, "Max-Age must be a positive integer");
      out.push(`Max-Age=${cookie.maxAge}`);
    }
    if (cookie.domain) {
      assert(typeof cookie.domain == 'string', 'Domain must be of type String');
      out.push(`Domain=${cookie.domain}`);
    }
    if (cookie.sameSite) {
      assert(typeof cookie.sameSite == 'string', 'sameSite must be of type String');
      out.push(`SameSite=${cookie.sameSite}`);
    }
    if (cookie.path) {
      assert(typeof cookie.path == 'string', 'Path must be of type String');
      out.push(`Path=${cookie.path}`);
    }
    if (cookie.expires) {
      // Numbers will be converted into a date N days in the future
      if (typeof cookie.expires === 'number') {
        cookie.expires = new Date(+new Date() + cookie.expires * 864e+5);
      }
      assert(cookie.expires instanceof Date, "Cookie expiration cannot be converted to a valid Date object")
      out.push(`Expires=${cookie.expires.toUTCString()}`);
    }

    return out.join("; ");

  }).join('; ');
}