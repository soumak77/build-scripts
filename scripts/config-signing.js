var fs = require('fs-extra');
var path = require('path');
var build = process.argv.length > 2 ? process.argv[2] : 'local';
var platform = process.argv.length > 3 ? process.argv[3] : 'browser';
var appnamesJson = require('../environments/shared/appname.json');

if (build == "release") {
	if (platform == "android") {
		fs.copySync("environments/release/release-signing.properties", "platforms/android/release-signing.properties");
	}
}
