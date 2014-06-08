'use strict';

var fs = require('fs');
var DIR = process.env.HOME + '/.npmregs';

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);

  if(fs.existsSync(process.env.HOME + '/.npmrc')) {
    var rc = fs.readFileSync(process.env.HOME + '/.npmrc').toString();

    var m = /registry.+http:\/\/(w3\.)?(.+)\..+/.exec(rc);
    var name = 'npm';
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
