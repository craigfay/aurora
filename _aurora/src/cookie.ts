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
 * Convert the entire Cookie jar to its string form
 */
export function stringify(jar: Cookie[]) {
  const cookies = jar.map(stringifyOne);
  return cookies.join('; ');
}

/**
 * Stringify a single Cookie
 * @param cookie
 */
function stringifyOne(cookie: Cookie) {

  let { name, value, ...attributes } = cookie;

  if (!attributes.path) attributes.path = '/';

  if (typeof attributes.expires === 'number') {
    const expirationString = new Date(new Date() * 1 + attributes.expires * 864e+5);
  }
  else if (attributes.expires instanceof Date) {
    // We're using "expires" because "max-age" is not supported by IE
    const expirationString = attributes.expires ? attributes.expires.toUTCString() : '';
  }

  try {
    var result = JSON.stringify(value);
    if (/^[\{\[]/.test(result)) {
      value = result;
    }
  } catch (e) {}

  value = encodeURIComponent(String(value))
    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

  name = encodeURIComponent(String(name))
    .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
    .replace(/[\(\)]/g, escape);

  var stringifiedAttributes = '';
  for (var attributeName in attributes) {
    if (!attributes[attributeName]) {
      continue;
    }
    stringifiedAttributes += '; ' + attributeName;
    if (attributes[attributeName] === true) {
      continue;
    }

    // Considers RFC 6265 section 5.2:
    // ...
    // 3.  If the remaining unparsed-attributes contains a %x3B (";")
    //     character:
    // Consume the characters of the unparsed-attributes up to,
    // not including, the first %x3B (";") character.
    // ...
    stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
  }

  return `${name}=${value}${stringifiedAttributes}`
}
