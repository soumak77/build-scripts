var fs = require('fs-extra');
var path = require('path');
var build = process.argv.length > 2 ? process.argv[2] : 'debug';
var platform = process.argv.length > 3 ? process.argv[3] : 'browser';

var srcIndex = 'src/index.html';
var content = fs.readFileSync(srcIndex).toString();
var cacheUrl = '';

if (platform === 'browser') {
  cacheUrl = `?v=${require('../package.json').version};`;
}

content = content.replace(/main\.css[^"]*"/, `main.css${cacheUrl}"`);
content = content.replace(/service-worker\.js[^"]*"/, `service-worker.js${cacheUrl}"`);
content = content.replace(/cordova\.js[^"]*"/, `cordova.js${cacheUrl}"`);
content = content.replace(/polyfills\.js[^"]*"/, `polyfills.js${cacheUrl}"`);
content = content.replace(/vendor\.js[^"]*"/, `vendor.js${cacheUrl}"`);
content = content.replace(/main\.js[^"]*"/, `main.js${cacheUrl}"`);

fs.writeFileSync(srcIndex, content);
