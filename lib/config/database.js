var dbUrl;

switch(process.env.NODE_ENV){
  case 'test':
    dbUrl = 'mongodb://localhost/dashy_test';
    break;
  case 'production':
    dbUrl = 'mongodb://localhost/dashy';
    break;
  case 'development':
  default:
    dbUrl = 'mongodb://localhost/dashy_development';
    break;
}

var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect(dbUrl);
db.on('error', console.error.bind(console, 'connection error:'));
