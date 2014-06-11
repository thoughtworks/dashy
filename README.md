[![Build Status](https://snap-ci.com/thoughtworks/dashy/branch/master/build_image)](https://snap-ci.com/thoughtworks/dashy/branch/master)

### Dashy

Dashboard that reports status of your integration points


# Get started

Requirements:
* [Node](http://nodejs.org/)
* [MongoDb](http://docs.mongodb.org/manual/installation/)

## Installation

    $ npm install dashy -g

## Running

    $ dashy start

### Report your request status

    curl --data "request[environment]=<ENVIRONMENT>&request[endpoint]=<ENDPOINT>&request[success]=<true|false>" \
    http://localhost:3000/api/requests/:app_id

### Contributing

I. Clone `$ git clone git@github.com:thoughtworks/dashy.git`

II. Install `$ make`

III. Start the server `$ npm start`