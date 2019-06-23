const { get } = require('../sessions');

module.exports = { sessionRetrieval };

async function sessionRetrieval(key) {
  return await get(key);
}
