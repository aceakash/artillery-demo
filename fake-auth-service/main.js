const app = require('express')(app);
const _ = require('lodash');
global.Promise = require('bluebird');

const sessionTokens = [];

// http://localhost:4567/authenticate?username=akash&passcode=boo
// will fail is username begins with z
app.get('/authenticate', (req, res) => {
  const [username, password] = [req.query.username, req.query.password];
  console.log(`/authenticate called with username ${username} and password ${password}`);
  if (username !== password) {
    return res.sendStatus(401);
  }
  const sessionToken = `session_${_.random(1, 10000)}`;
  sessionTokens.push(sessionToken);
  res.json({
    userId: `user_${username}`,
    sessionToken: sessionToken
  });
});

app.get('/session/keep-alive', (req, res) => {
  console.log('sessionTokens', sessionTokens);
  if (sessionTokens.indexOf(req.query.sessionToken) === -1) {
    return res.sendStatus(401);
  }
  res.json({
    sessionToken: req.query.sessionToken
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Fake Auth Service started on port ${process.env.PORT}`);
});
