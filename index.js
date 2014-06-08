'use strict';

var fs = require('fs');
var npm = require('npm');

var DIR = process.env.HOME + '/.npmregs';

module.exports.list = function list() {
  (function print(regs, index) {
    console.log(index + ':' + regs[index]);
    if(++index < regs.length) { print(regs, index); }
  })(fs.readdirSync(DIR), 0);
};

module.exports.add = function add(argv) {
  var m = /http[s]?:\/\/(.+\.)?(.+)\..+$/.exec(argv._[1]);
  var name = argv.n || m[2];
  var config = 'registry = ' + argv._[1];

  npm.load({loaded:false}, function(err) {
    if(err) { console.log(err); process.exit(1); }
    npm.config.sources.user.path= DIR + '/' + name;
    npm.config.set('registry', argv._[1]);
    npm.adduser(function() {
      fs.appendFile(DIR + '/' + name, config, function(err) {
        console.log('Added registry: ' + name);
      });
    });
  });
};

module.exports.use = function use(argv) {
  if (fs.existsSync(process.env.HOME + '/.npmrc')) {
    fs.unlinkSync(process.env.HOME + '/.npmrc');
  }
  fs.symlinkSync(DIR + '/' + argv._[1], process.env.HOME + '/.npmrc');
};

module.exports.remove = function remove(argv) {
  if (fs.existsSync(DIR + '/' + argv._[1])) {
    fs.unlinkSync(DIR + '/' + argv._[1]);
  }
};

