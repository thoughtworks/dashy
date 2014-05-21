### Dashy

Dashy


### Get started

Requirements:
- Install MongoDb: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

`$ npm install`

`$ mongod --fork # Init mongo in a child process`

`$ npm start`

`$ grunt test`


#### Send a request

curl --data "request[environment]=<ENVIRONMENT>&request[endpoint]=<ENDPOINT>&request[success]=<true|false>" \
     http://localhost:3000/requests/:app_id