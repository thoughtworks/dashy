[![Build Status](https://snap-ci.com/rafbgarcia/dashy/branch/master/build_image)](https://snap-ci.com/rafbgarcia/dashy/branch/master)

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

curl --data "request[environment]=<ENVIRONMENT>&request[endpoint]=<ENDPOINT>&request[success]=<true|false>" http://localhost:3000/requests/:app_id


## License

The MIT License

Copyright (c) 2014 Rafael Garcia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
