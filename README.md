[![Build Status](https://snap-ci.com/thoughtworks/dashy/branch/master/build_image)](https://snap-ci.com/thoughtworks/dashy/branch/master)

### Dashy

Dashy


### Get started

Requirements:
* [Node](http://nodejs.org/)
* [MongoDb](http://docs.mongodb.org/manual/installation/)

I. Clone the project

II. Install the project `$ make`

III. Start the server `$ npm start`

#### Report your request status

    curl --data "request[environment]=<ENVIRONMENT>&request[endpoint]=<ENDPOINT>&request[success]=<true|false>" \
    http://localhost:3000/requests/:app_id
