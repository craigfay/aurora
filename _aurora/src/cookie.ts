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

    value = encodeURIComponent(String(value))
      .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

    name = encodeURIComponent(String(name))
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[\(\)]/g, escape);

    var stringifiedAttributes = '';
    for (const attributeName in attributes) {

      let attributeValue = attributes[attributeName];
      stringifiedAttributes += '; ';

      if (!attributeValue) {
        continue;
      }

      if (attributeName === 'expires') {
        if (typeof attributeValue === 'number') {
          const dateString = new Date(+new Date() + attributeValue * 864e+5);
          stringifiedAttributes += `Expires=${dateString}`
          continue;
        } else if (attributeValue instanceof Date) {
          // We're using "expires" because "max-age" is not supported by IE
          const dateString= attributes.expires ? attributeValue.toUTCString() : '';
          stringifiedAttributes += `Expires=${dateString}`
          continue;
        }
      }

      if (attributeName === 'maxAge') {
        assert(Number.isInteger(attributeValue) && attributeValue > 0, "Max-Age must be a positive integer")
        stringifiedAttributes += `Max-Age=${attributeValue}`;
        continue;
      }

      if (attributeName === 'httpOnly') {
        stringifiedAttributes += 'HttpOnly';
        continue;
      }

      stringifiedAttributes += attributeName;
      if (attributeValue === true) {
        continue;
      }

      // Considers RFC 6265 section 5.2
      stringifiedAttributes += '=' + attributeValue.split(';')[0];
    }

    return `${name}=${value}${stringifiedAttributes}`;

  }).join('; ');
}
