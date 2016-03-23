```
npm i
```

then start the fake server (for demo):

```
PORT=4567 node fake-auth-service/index.js
```

then in another terminal, run the load test:

```
./node_modules/artillery/bin/artillery run happy-path.json
```
