import * as Cookie from './cookie';
import { strict as assert } from 'assert';

export const tests = [
  cookieStringifyTest,
  cookieStringifyAttributesTest,
  cookieExpiresTest,
];

async function cookieStringifyTest() {
  const description = `Cookie shaped objects
  can be converted to a "set-cookie" compatible value`;

  try {
    assert.equal(
      Cookie.stringify(
        { name: 'dark', value: 'spruce' },
      ),
      'dark=spruce'
    );

    assert.equal(
      Cookie.stringify(
        { name: 'forest', value: 'frowned' },
        { name: 'either', value: 'side' },
      ),
      'forest=frowned; either=side'
    );

    assert.equal(
      Cookie.stringify(
        { name: 'forest', value: 'waterway' },
        { name: 'trees', value: 'stripped' },
        { name: 'recent', value: 'wind' },
      ),
      'forest=waterway; trees=stripped; recent=wind'
    );

    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}

async function cookieStringifyAttributesTest() {
  const description = `Attributes should be stringified
  Arbitrarily`;

  try {
    assert.equal(
      Cookie.stringify(
        { name: 'white', value: 'covering', secure: true },
        { name: 'of', value: 'frost' },
      ),
      'white=covering; secure; of=frost'
    );

    assert.equal(
      Cookie.stringify(
        { name: 'they', value: 'seemed', httpOnly: true },
        { name: 'to', value: 'lean', maxAge: 2 },
        { name: 'towards', value: 'eachother' },
      ),
      'they=seemed; HttpOnly; to=lean; Max-Age=2; towards=eachother'
    );

    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}

async function cookieExpiresTest() {
  const description = `The "expires" attribute should
  accept both Date objects and numbers.`;

  try {
    assert.equal(
      Cookie.stringify(
        { name: 'black', value: 'ominous', expires: new Date(Date.UTC(1994, 10, 1, 17, 36))},
      ),
      'black=ominous; Expires=Tue, 01 Nov 1994 17:36:00 GMT'
    );

    assert.equal(
      Cookie.stringify(
        { name: 'fading', value: 'light', expires: new Date(Date.UTC(1975, 8, 6, 5, 20))},
      ),
      'fading=light; Expires=Sat, 06 Sep 1975 05:20:00 GMT'
    );

    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}
