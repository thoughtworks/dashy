#!/usr/bin/env node

var program = require('commander')
  , npm = require("npm")
  , pkg = require(__dirname + '/package.json');

program
  .version(pkg.version)
  .option('-s, --start', 'starts the server')
  .parse(process.argv);

process.chdir(__dirname);

if (program.start) {
  var npm = require("npm");
  npm.load({}, function (error) {
    if (error) return;
    npm.commands.start();
  });
} else {
  program.help();
}