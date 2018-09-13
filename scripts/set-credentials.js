var util = require('util');
var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var configFilePath = './config.xml';
var platformVersion = false;
var incrementVersion = true;
var build = process.argv.length > 2 ? process.argv[2] : 'debug';
var platform = process.argv.length > 3 ? process.argv[3] : 'browser';
var credentialsPath = '../environments/' + (build === 'release' ? 'release' : 'debug') + '/credentials.json';
var credentials = require(credentialsPath);

setCredentialsInConfigXml();
setCredentialsInPackageJson();

function setCredentialsInPackageJson() {
	var packageJson = require('../package.json');
	packageJson.cordova.plugins['cordova-plugin-facebook4'].APP_ID = credentials.facebook.appid;
	packageJson.cordova.plugins['cordova-plugin-facebook4'].APP_NAME = credentials.facebook.appname;

	packageJson.cordova.plugins['cordova-plugin-linkedin'].APP_ID = credentials.linkedin.appid;

	packageJson.cordova.plugins['twitter-connect-plugin'].FABRIC_KEY = credentials.twitter.fabrickey;

	utils.writePackageJsonSync(packageJson);
}

function setCredentialsInConfigXml() {
	var result = utils.readXmlSync(configFilePath);
	updateConfig(result);
}

function updateConfig(configOpts) {
		updateStringsXml(configOpts);
		updateFacebookConfig(configOpts);
		updateTwitterConfig(configOpts);
		updateLinkedinConfig(configOpts);

		utils.writeXmlSync(configFilePath, configOpts);
}

function updateStringsXml(configOpts) {
		// update facebook strings
		const androidplatform = configOpts.widget.platform.find(function(platform) {
			return platform.$.name == 'android';
		});
		const stringsXml = androidplatform['config-file'].find(function(configFile) {
			return configFile.$.target == './res/values/strings.xml';
		});
		const facebookappid = stringsXml.string.find(function(str) {
			return str.$.name == 'fb_app_id';
		});
		const facebookappname = stringsXml.string.find(function(str) {
			return str.$.name == 'fb_app_name';
		});
		facebookappid._ = credentials.facebook.appid;
		facebookappname._ = credentials.facebook.appname;
}

function updateFacebookConfig(configOpts) {
		// update plugin
		const facebookplugin = configOpts.widget.plugin.find(function(plugin) {
			return plugin.$.name == 'cordova-plugin-facebook4';
		});
		const facebookappid = facebookplugin.variable.find(function(plugin) {
			return plugin.$.name == 'APP_ID';
		});
		const facebookappname = facebookplugin.variable.find(function(plugin) {
			return plugin.$.name == 'APP_NAME';
		});
		facebookappid.$.value = credentials.facebook.appid;
		facebookappname.$.value = credentials.facebook.appname;
}

function updateTwitterConfig(configOpts) {
		// update preferences
		const twitterkey = configOpts.widget.preference.find(function(plugin) {
			return plugin.$.name == 'TwitterConsumerKey';
		});
		const twittersecret = configOpts.widget.preference.find(function(plugin) {
			return plugin.$.name == 'TwitterConsumerSecret';
		});
		twitterkey.$.value = credentials.twitter.key;
		twittersecret.$.value = credentials.twitter.secret;

		// update plugin
		const twitterplugin = configOpts.widget.plugin.find(function(plugin) {
			return plugin.$.name == 'twitter-connect-plugin';
		});
		const twitterfabrickey = twitterplugin.variable.find(function(plugin) {
			return plugin.$.name == 'FABRIC_KEY';
		});
		twitterfabrickey.$.value = credentials.twitter.fabrickey;
}

function updateLinkedinConfig(configOpts) {
		// update plugin
		const linkedinplugin = configOpts.widget.plugin.find(function(plugin) {
			return plugin.$.name == 'cordova-plugin-linkedin';
		});
		const linkedinappid = linkedinplugin.variable.find(function(plugin) {
			return plugin.$.name == 'APP_ID';
		});
		linkedinappid.$.value = credentials.linkedin.appid;
}
