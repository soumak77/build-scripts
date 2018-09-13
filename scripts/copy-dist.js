var fs = require('fs-extra');
var path = require('path');
var platform = process.argv.length > 2 ? process.argv[2] : 'browser';
var build = process.argv.length > 3 ? process.argv[3] : 'debug';
var appnamesJson = require('../environments/shared/appname.json');

switch (platform) {
	case "ios":
		if (build == "release") {
			copy("platforms/ios/build/device/" + appnamesJson.ios + ".ipa","dist/release/ios/" + appnamesJson.ios + ".ipa");
		} else {
			copy("platforms/ios/build/device/" + appnamesJson.ios + ".ipa","dist/debug/ios/" + appnamesJson.ios + ".ipa");
		}
		break;
	case "android":
		if (build == "release") {
			copy("platforms/android/app/build/outputs/apk/release/app-release.apk","dist/release/android/" + appnamesJson.android + ".apk");
		} else {
			copy("platforms/android/app/build/outputs/apk/release/app-debug.apk","dist/debug/android/" + appnamesJson.android + ".apk");
		}
		break;
	case "browser":
		if (build == "release") {
			copy("platforms/browser/package.zip","dist/release/browser/package.zip");
		} else {
			copy("platforms/browser/package.zip","dist/debug/browser/package.zip");
		}
		break;
}

function copy(src, dest) {
	fs.copySync(path.resolve(__dirname,'../' + src), path.resolve(__dirname,'../' + dest));
}
