var fs = require('fs-extra');
var path = require('path');
var build = process.argv.length > 2 ? process.argv[2] : 'debug';
var platform = process.argv.length > 3 ? process.argv[3] : 'browser';
var indexPath = 'src/index.html';

var environmentPath = 'src/environment.ts';
var environmentJsonString = fs.readFileSync(environmentPath)
	.toString()
	.replace('export const environment = ', '')
	.replace('};', '}');
var environmentJson = JSON.parse(environmentJsonString);

/*
if (platform == 'ios' || platform == 'android' || (platform == 'browser' && build == 'local')) {
	environmentJson.ionic.locationStrategy = 'hash';
	environmentJson.ionic.baseHref = '/';
} else {
	environmentJson.ionic.locationStrategy = 'path';
	environmentJson.ionic.baseHref = '/app';
}
*/
environmentJson.ionic.locationStrategy = 'hash';
environmentJson.ionic.baseHref = '/';

/*
 * Start updating index.html
 */
var content = fs.readFileSync(indexPath).toString();

// remove base href
content = content.replace(/\n  <base href=".*"><\/base>/, '');

// reset service-worker.js path
content = content.replace(/navigator\.serviceWorker\.register\(".*"\)/, 'navigator.serviceWorker.register("service-worker.js")');

// reset main.css path
content = content.replace(/<link rel="stylesheet" href=".*">/, '<link rel="stylesheet" href="build/main.css">');

if (environmentJson.ionic.baseHref !== '/') {
	// set base href
	content = content.replace(/<\/head>/, `  <base href="${environmentJson.ionic.baseHref}/"></base>\n</head>`);

	// set path to service-worker.js
	content = content.replace(/navigator\.serviceWorker\.register\(".*"\)/, `navigator.serviceWorker.register("${environmentJson.ionic.baseHref}/service-worker.js")`);

	// set path to build.css
	content = content.replace(/<link rel="stylesheet" href=".*">/, `<link rel="stylesheet" href="${environmentJson.ionic.baseHref}/build/main.css">`);
}

fs.writeFileSync(indexPath, content);
/*
 * Finished updating index.html
 */

/*
 * Start updating environment.ts
 */
fs.writeFileSync(environmentPath, 'export const environment = ' + JSON.stringify(environmentJson, null, 2) + ';');
/*
 * Finished updating environment.ts
 */
