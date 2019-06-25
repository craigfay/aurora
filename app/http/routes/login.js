const { HttpResponse, Cookie } = require('../../../_core/dist/main');
const { sessionCreation } = require('../../services/session-creation')

module.exports = { handleLogin };

async function handleLogin(request, context) {
  const sessionId = await sessionCreation();
  if (sessionId) {
    const cookie = Cookie.stringify({ sessionId });
    return new HttpResponse({
      headers: { 'set-cookie': cookie },
      body: 'Login Successful'
    });
  }
}
