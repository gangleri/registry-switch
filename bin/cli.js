#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var parseArgs = require('minimist');
var regSwitch = require('..');

var argOpts = {string:['n'], boolean:['h'], alias:{'n':'name', 'h':'help'}};
var argv = parseArgs(process.argv.slice(2), argOpts);

var cmd = argv._[0] || 'list';

var displayUsage = function displayUsage() {
  fs.createReadStream(path.join(__dirname, '/usage.txt')).
    pipe(process.stdout);
};

var displayVersion= function displayVersion() {
  console.log('Version: ' + require('../package').version);
};

if(!fs.existsSync(process.env.HOME + '/.npmregs')) {
  regSwitch.init();
}

if (argv.h) {
  displayUsage();
} else if (argv.v) {
  displayVersion();
} else {
  if(!regSwitch[cmd]) {
    console.log('unknown command.')
    process.exit(1);
  }
  regSwitch[cmd](argv);
}

