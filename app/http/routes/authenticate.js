const { HttpResponse, Cookie } = require('../../../_core/dist/main');
const { sessionRetrieval } = require('../../services/session-retrieval');

module.exports = { authenticate };

async function authenticate(req, meta) {
  const { sessionId } = context;
  if (sessionId && await sessionRetrieval(sessionId)) {
    return new HttpResponse({ body: 'You are authenticated!' });
  }
}
