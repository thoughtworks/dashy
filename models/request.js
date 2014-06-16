var mongoose = require('mongoose');

var schema = mongoose.Schema({
  appKey: String,
  service: String,
  success: Boolean,
  date: { type: Date, default: Date.now },
  meta: {}
});

module.exports = mongoose.model('Request', schema);