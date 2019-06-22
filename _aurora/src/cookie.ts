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
  const c = cookies!.split(";");
  for (const kv of c) {
    const cookieVal = kv.split("=");
    const key = cookieVal.shift()!.trim();
    out[key] = cookieVal.join("=");
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

    let out = [`${name}=${value}`];

    if (cookie.secure) {
      out.push("Secure");
    }
    if (cookie.httpOnly) {
      out.push("HttpOnly");
    }
    if (Number.isInteger(cookie.maxAge!)) {
      assert(cookie.maxAge! > 0, "Max-Age must be a positive integer");
      out.push(`Max-Age=${cookie.maxAge}`);
    }
    if (cookie.domain) {
      out.push(`Domain=${cookie.domain}`);
    }
    if (cookie.sameSite) {
      out.push(`SameSite=${cookie.sameSite}`);
    }
    if (cookie.path) {
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
    if (cookie.unparsed) {
      out.push(cookie.unparsed.join("; "));
    }

    return out.join("; ");

  }).join('; ');
}
