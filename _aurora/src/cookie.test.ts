import * as Cookie from './cookie';
import { strict as assert } from 'assert';

export const tests = [
  cookieStringifyTest,
  cookieSecureTest,
  cookieHttpOnlyTest,
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

async function cookieSecureTest() {
  const description = `The "Secure" attribute
  should accept truthy values`;

  try {
    assert.equal(
      Cookie.stringify(
        { name: 'white', value: 'covering', secure: true },
        { name: 'of', value: 'frost' },
      ),
      'white=covering; Secure; of=frost'
    );

    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}

async function cookieHttpOnlyTest() {
  const description = `The "httpOnly" attribute
  should accept truthy values`;

  try {
    assert.equal(
      Cookie.stringify(
        { name: 'they', value: 'seemed', httpOnly: true },
        { name: 'to', value: 'lean' },
        { name: 'towards', value: 'eachother', httpOnly: true },
      ),
      'they=seemed; HttpOnly; to=lean; towards=eachother; HttpOnly'
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
        { name: 'fading', value: 'light', expires: new Date(Date.UTC(1960, 8, 6, 5, 20))},
      ),
      'fading=light; Expires=Tue, 06 Sep 1960 05:20:00 GMT'
    );

    assert.equal(
      Cookie.stringify(
        { name: 'vast', value: 'silence', expires: new Date(Date.UTC(2056, 2, 20, 17, 5))},
      ),
      'vast=silence; Expires=Mon, 20 Mar 2056 17:05:00 GMT'
    );

    assert(Cookie.stringify({ name: 'reigned', value: 'over', expires: 3 }));
    assert(Cookie.stringify({ name: 'the', value: 'land', expires: -5 }));
    assert(Cookie.stringify({ name: 'the', value: 'land', expires: 0 }));
    assert(Cookie.stringify({ name: 'itself', value: 'was', expires: .5 }));

    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}
