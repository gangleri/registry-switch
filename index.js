'use strict';

var fs = require('fs');

var DIR = process.env.HOME + '/.npmregs';

module.exports.list = function list() {
  (function print(regs, index) {
    console.log(index + ':' + regs[index]);
    if(++index < regs.length) print(regs, index);
  })(fs.readdirSync(DIR), 0);
};

module.exports.add = function add(argv) {
  var m = /http:\/\/(w3\.)?(.+)\..+$/.exec(argv._[1]);
  var name = argv.n || m[2];
  var config = 'registry = ' + argv._[1];

  fs.writeFile(DIR + '/' + name, config, function(err) {
    if (err) {
      console.log(err);
    } else { console.log('Created registry ' + name ); }
  });
};

module.exports.use = function use(argv) {
  if (fs.existsSync(process.env.HOME + '/.npmrc'))
    fs.unlinkSync(process.env.HOME + '/.npmrc');
  fs.symlinkSync(DIR + '/' + argv._[1], process.env.HOME + '/.npmrc');
};

module.exports.remove = function remove(argv) {
  if (fs.existsSync(DIR + '/' + argv._[1]))
    fs.unlinkSync(DIR + '/' + argv._[1]);
};

