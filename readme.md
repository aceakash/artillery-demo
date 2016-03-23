#What
This is a playground for trying out [artillery](https://artillery.io/), a load-testing framework in Node.js.

#Why
Having used [Gatling](http://gatling.io/#/) at work, and having struggled a bit with Scala, I was looking for an alternative in Node.js.

[loadtest](https://github.com/alexfernandez/loadtest) is good, but it's more of a replacement for [ab](https://httpd.apache.org/docs/2.4/programs/ab.html), and can only test against individual URLs.

Artillery can run scenarios - refer to the [documentation](https://artillery.io/docs/) for more details.

# The fake service

Install dependencies with `npm install`

This project sets up a demo service, defined in the `fake-auth-service` folder. Start it:

```
PORT=4567 node fake-auth-service/index.js
```

This service exposes two endpoints:

### GET /authenticate
If the provided username and password are the same, returns status (200 OK) and a JSON response with `userId` and `sessionToken`.

e.g. `curl -v http://localhost:4567/authenticate?username=akash&password=akash`
will return

```
(200 OK)
{
    "sessionToken": "session_4137",
    "userId": "user_akash"
}
```
The generated `sessionToken` is added to an in-memory list and can then be used with the `/session/keep-alive` endpoint.

If the username and password are not the same, we get back a `401 Unauthorized`.

e.g. `curl -v http://localhost:4567/authenticate?username=akash&password=notakash`

### GET /session/keep-alive
If the session exists, echos back the provided `sessionToken` with a (200 OK) response code.

e.g. `curl -v http://localhost:4567/session/keep-alive?sessionToken=session_4137`
returns
```
(200 OK)
{
    "sessionToken": "session_4137"
}
```

If the session does not exist, we get back a `401 Unauthorized`

# The load testing
Once you have the fake service running, in another terminal, run the load test:

```
./node_modules/artillery/bin/artillery run happy-path.json
```

Take a close look at [happy-path.json] for what actually runs, but the gist is that it runs a load test on a *scenario*, where the scenario is:

* Call the /authenticate endpoint, and capture the `sessionToken` returned
* Call the /session/keep-alive endpoint with the captured `sessionToken`
