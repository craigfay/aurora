const querystring = require('querystring');
const { HttpResponse, Cookie } = require('../../../_core/dist/main');
const { sessionCreation } = require('../../services/session-creation');
const { userRetrieval } = require('../../services/user-retrieval');

module.exports = { login };

async function login(req, meta) {
  try {
    
    const { username, password } = JSON.parse(body);
    
    const [user] = await userRetrieval({ username, password });
    
    if (!user) {
      return new HttpResponse({
        status: 400,
        body: 'Invalid Credentials'
      });
    }
    
    const sessionId = await sessionCreation(username);
    
    if (sessionId) {
      const cookie = Cookie.stringify({ sessionId });
      return new HttpResponse({
        headers: { 'set-cookie': cookie },
        body: 'Login Successful'
      });
    }
  }

  catch (e) {
    console.error(e);
    return new HttpResponse({
      status: 500,
      body: 'Internal Server Error'
    });
  }
}
