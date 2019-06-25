const { HttpResponse, Cookie } = require('../../../_core/dist/main');
const { userRetrieval } = require('../../services/user-retrieval');

module.exports = { getUsers };

async function getUsers(req, meta) {
  const json = JSON.stringify(await userRetrieval());
  return new HttpResponse({ body: json });
}
