'use strict';

var fs = require('fs');
var path = require('path');
var npm = require('npm');

var DIR = process.env.HOME + '/.npmregs';

module.exports.init = function init() {
  if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR);

    if(fs.existsSync(process.env.HOME + '/.npmrc')) {
      var rc = fs.readFileSync(process.env.HOME + '/.npmrc').toString();

      var m = /registry.+http:\/\/(w3\.)?(.+)\..+/.exec(rc);
      var name = 'npmjs';
      if(m) {
        name = m[2];
      }
      var out = fs.createWriteStream(DIR + '/' + name);
      out.on('close', function() {
        fs.unlinkSync(process.env.HOME + '/.npmrc');
        fs.symlinkSync(DIR + '/' + name, process.env.HOME + '/.npmrc');
      });
      fs.createReadStream(process.env.HOME + '/.npmrc').pipe(out);
    }
  }
};

module.exports.list = function list() {
  var regs = [];
  if(fs.existsSync(DIR) && (regs = fs.readdirSync(DIR)).length > 0) {
    var current = (fs.existsSync(process.env.HOME + '/.npmrc') && path.basename(fs.readlinkSync(process.env.HOME + '/.npmrc')))|| '';
    (function print(regs, index) {
      if(regs[index] === current) {
        console.log('▶ ' + regs[index]);
      } else {
        console.log('  ' + regs[index]);
      }
      if(++index < regs.length) { print(regs, index); }
    })(regs, 0);
  } else {
    console.log('No npm registries found');
  }
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
        if(err) { console.log(err); }
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

