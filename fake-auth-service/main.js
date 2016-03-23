const app = require('express')(app);
const _ = require('lodash');
global.Promise = require('bluebird');

const sessionTokens = [];

// http://localhost:4567/authenticate?username=akash&passcode=boo
// will return 401 if username != password
app.get('/authenticate', (req, res) => {
  const [username, password] = [req.query.username, req.query.password];
  const message = `/authenticate called with username ${username} and password ${password}`;
  if (username !== password) {
    console.log(`${message}, returning 401`);
    return res.sendStatus(401);
  }
  const sessionToken = `session_${_.random(1, 10000)}`;
  sessionTokens.push(sessionToken);
  console.log(`${message}, returning sessionToken ${sessionToken}`);
  res.json({
    userId: `user_${username}`,
    sessionToken: sessionToken
  });
});

// will return 401 if session not valid
app.get('/session/keep-alive', (req, res) => {
  //console.log('sessionTokens', sessionTokens);
  const message = `/session/keep-alive called with sessionToken ${req.query.sessionToken}`;
  if (sessionTokens.indexOf(req.query.sessionToken) === -1) {
    console.log(`${message}, not found in sessions, returning 401`);
    return res.sendStatus(401);
  }
  console.log(`${message}, returning 200`);
  res.json({
    sessionToken: req.query.sessionToken
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Fake Auth Service started on port ${process.env.PORT}`);
});
