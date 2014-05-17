var mongoose = require('mongoose');

var schema = mongoose.Schema({
  name: String
});

modules.export = mongoose.model('Application', schema);
