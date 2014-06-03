[![Build Status](https://snap-ci.com/thoughtworks/dashy/branch/master/build_image)](https://snap-ci.com/thoughtworks/dashy/branch/master)

### Dashy

Dashy


### Get started

Requirements:
- [Node](http://nodejs.org/)
- [MongoDb](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

I. Clone the project

II. Install dependencies `$ npm install`

III. Init MonboDb `$ mongod --fork # Init mongo in a child process`

IV. Start the server `$ npm start`


#### Send a request

`curl --data "request[environment]=<ENVIRONMENT>&request[endpoint]=<ENDPOINT>&request[success]=<true|false>" http://localhost:3000/requests/:app_id`
