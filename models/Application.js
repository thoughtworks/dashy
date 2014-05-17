var database = require('../config/database');
var mongoose = require('mongoose');

var schema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Application', schema);
