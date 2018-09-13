var fs = require('fs-extra');
var path = require('path');
var build = process.argv.length > 2 ? process.argv[2] : 'local';
var platform = process.argv.length > 3 ? process.argv[3] : 'browser';

if (build == "release") {
	fs.copySync("environments/release/firebase.config.ts", "src/app/firebase.config.ts");
	fs.copySync("environments/release/environment.ts", "src/environment.ts");

	if (platform === "android") {
		fs.copySync("environments/release/google-services.json", "google-services.json");
	} else if (platform === "ios") {
		fs.copySync("environments/release/GoogleService-Info.plist", "GoogleService-Info.plist");
	}
} else if (build == "debug") {
	fs.copySync("environments/debug/firebase.config.ts", "src/app/firebase.config.ts");
	fs.copySync("environments/debug/environment.ts", "src/environment.ts");

	if (platform === "android") {
		fs.copySync("environments/debug/google-services.json", "google-services.json");
	} else if (platform === "ios") {
		fs.copySync("environments/debug/GoogleService-Info.plist", "GoogleService-Info.plist");
	}
} else {
	// local build
	fs.copySync("environments/local/firebase.config.ts", "src/app/firebase.config.ts");
	fs.copySync("environments/local/environment.ts", "src/environment.ts");
}

setEnvironmentVersion();

function setEnvironmentVersion() {
	var packageVersion = require('../package.json').version
	var environmentPath = 'src/environment.ts';
	var environmentJsonString = fs.readFileSync(environmentPath)
		.toString()
		.replace('export const environment = ', '')
		.replace('};', '}');
	var environmentJson = JSON.parse(environmentJsonString);
	environmentJson.version = packageVersion;
	fs.writeFileSync(environmentPath, 'export const environment = ' + JSON.stringify(environmentJson, null, 2) + ';');
	console.log('Saved in ' + environmentPath);
}
