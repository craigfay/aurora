import { strict as assert } from 'assert';

export interface Cookie {
  [name:string]: [string, CookieOptions?]
}

export interface CookieOptions {
  expires?: Date | number;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: SameSite;
  unparsed?: string[];
}

export type SameSite = "Strict" | "Lax";

/**
 * Parse the "Cookies" header value into an object
 * @param cookies
 */
export function parse(cookies: string): object {
  const out = {};
  if (typeof cookies === 'string') {
    const c = cookies!.split(";");
    for (const kv of c) {
      const cookieVal = kv.split("=");
      const key = cookieVal.shift()!.trim();
      out[key] = cookieVal.join("=");
    }
  }
  return out;
}

/**
 * Stringify an arbitrary amount of cookie objects 
 * @param cookies
 */
export function stringify(cookie: Cookie) {

  const names = Object.keys(cookie);

  return names.map(name => {
    let [value, options] = cookie[name];

    if (!options) {
      options = {};
    }

    const encodedValue = encodeURIComponent(String(value))
      .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

    const encodedName = encodeURIComponent(String(name))
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[\(\)]/g, escape);

    // ref: https://tools.ietf.org/html/draft-ietf-httpbis-cookie-prefixes-00#section-3.1
    if (encodedName.startsWith("__Secure")) {
      options.secure = true;
    }
    if (encodedName.startsWith("__Host")) {
      options.path = "/";
      options.secure = true;
      delete options.domain;
    }

    let out = [`${encodedName}=${encodedValue}`];

    if (options.secure) {
      out.push("Secure");
    }
    if (options.httpOnly) {
      out.push("HttpOnly");
    }
    if (typeof options.maxAge == 'number') {
      assert(Number.isInteger(options.maxAge) && options.maxAge > 0, "Max-Age must be a positive integer");
      out.push(`Max-Age=${options.maxAge}`);
    }
    if (options.domain) {
      assert(typeof options.domain == 'string', 'Domain must be of type String');
      out.push(`Domain=${options.domain}`);
    }
    if (options.sameSite) {
      assert(typeof options.sameSite == 'string', 'sameSite must be of type String');
      out.push(`SameSite=${options.sameSite}`);
    }
    if (options.path) {
      assert(typeof options.path == 'string', 'Path must be of type String');
      out.push(`Path=${options.path}`);
    }
    if (options.expires) {
      // Numbers will be converted into a date N days in the future
      if (typeof options.expires === 'number') {
        options.expires = new Date(+new Date() + options.expires * 864e+5);
      }
      assert(options.expires instanceof Date, "Cookie expiration cannot be converted to a valid Date object")
      out.push(`Expires=${options.expires.toUTCString()}`);
    }
    if (options.unparsed) {
      out.push(options.unparsed.join("; "));
    }

    return out.join("; ");

  }).join('; ');
}
