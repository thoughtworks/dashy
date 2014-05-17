var mongoose = require('mongoose');

var schema = mongoose.Schema({
  name: String,
  key: String,
  date: { type: Date, default: Date.now },
  requests: [{
    endpoint: String,
    success: Boolean
  }]
});

schema.pre('save', function (next) {
  this.key = generateUniqueKey();
  next();
});

module.exports = mongoose.model('Application', schema);

function generateUniqueKey() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()).toUpperCase();
}