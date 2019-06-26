const { HttpResponse, Cookie } = require('../../../_core/dist/main');
const { sessionCreation } = require('../../services/session-creation');
const { userRetrieval } = require('../../services/user-retrieval');

module.exports = { login };

async function login(req, meta) {
  try {
    
    const { username, password } = req.body;
    if (!username || !password) {
      return new HttpResponse({ status: 400, body: 'Invalid Request' });
    }
    
    const [user] = await userRetrieval({ username, password });
    
    if (!user) {
      return new HttpResponse({
        status: 400,
        body: 'Invalid Credentials'
      });
    }

    const sessionId = await sessionCreation(username);

    if (sessionId) {
      const cookie = Cookie.stringify({ name: 'sessionId', value: sessionId });
      return new HttpResponse({
        headers: { 'set-cookie': cookie },
        body: 'Login Successful'
      });
    }
  }

  catch (e) {
    return new HttpResponse({ status: 500, body: 'Internal Server Error' });
  }
}
