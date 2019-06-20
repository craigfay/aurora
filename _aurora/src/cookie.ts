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
    let { name, value, ...attributes } = cookie;
  
    if (typeof attributes.expires === 'number') {
      const expirationString = new Date(+new Date() + attributes.expires * 864e+5);
    } else if (attributes.expires instanceof Date) {
      // We're using "expires" because "max-age" is not supported by IE
      const expirationString = attributes.expires ? attributes.expires.toUTCString() : '';
    }
  
    value = encodeURIComponent(String(value))
      .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
  
    name = encodeURIComponent(String(name))
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[\(\)]/g, escape);
  
    var stringifiedAttributes = '';
    for (var key in attributes) {

      const value = attributes[key];
      stringifiedAttributes += '; ';
      
      if (!value) {
        continue;
      }

      if (key === 'maxAge') {
        assert(Number.isInteger(value) && value > 0, "Max-Age must be a positive integer")
        stringifiedAttributes += `Max-Age=${value}`;
        continue;
      }

      if (key === 'httpOnly') {
        stringifiedAttributes += 'HttpOnly';
        continue;
      }

      stringifiedAttributes += key;
      if (value === true) {
        continue;
      }

      // Considers RFC 6265 section 5.2
      stringifiedAttributes += '=' + attributes[key].split(';')[0];
    }

    return `${name}=${value}${stringifiedAttributes}`;

  }).join('; ');
}
