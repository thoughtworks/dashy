#!/usr/bin/env node

var program = require('commander');
var npm = require("npm");

program
  .version('0.0.1')
  .option('start', 'Starts Dashy server')
  .parse(process.argv);

if (program.start) {
  var npm = require("npm");
  npm.load({}, function (error) {
    if (error) return;
    npm.commands.start();
  });
}