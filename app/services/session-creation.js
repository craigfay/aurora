const crypto = require('crypto');
const { set } = require('../sessions');

module.exports = { sessionCreation };

async function sessionCreation(key) {
  let sessionId = crypto.randomBytes(32).toString("hex");
  if ('OK' == await set(sessionId, key)) return sessionId;
}
