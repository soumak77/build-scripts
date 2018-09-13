var util = require('util'),
		fs = require('fs'),
    path = require('path'),
		utils = require('./utils'),
    xml2js = require('xml2js'),

    configFilePath = './config.xml',
    platformVersion = false,
    incrementVersion = true;

var parser = new xml2js.Parser();

clearCredentialsInPackageJson();
clearCredentialsInConfigXml();

function clearCredentialsInPackageJson() {
	var packageJson = require('../package.json');
	packageJson.cordova.plugins['cordova-plugin-facebook4'].APP_ID = '';
	packageJson.cordova.plugins['cordova-plugin-facebook4'].APP_NAME = '';

	packageJson.cordova.plugins['cordova-plugin-linkedin'].APP_ID = '';

	packageJson.cordova.plugins['twitter-connect-plugin'].FABRIC_KEY = '';

	utils.writePackageJsonSync(packageJson);
}

function clearCredentialsInConfigXml() {
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
		facebookappid._ = '';
		facebookappname._ = '';
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
		facebookappid.$.value = '';
		facebookappname.$.value = '';
}

function updateTwitterConfig(configOpts) {
		// update preferences
		const twitterkey = configOpts.widget.preference.find(function(plugin) {
			return plugin.$.name == 'TwitterConsumerKey';
		});
		const twittersecret = configOpts.widget.preference.find(function(plugin) {
			return plugin.$.name == 'TwitterConsumerSecret';
		});
		twitterkey.$.value = '';
		twittersecret.$.value = '';

		// update plugin
		const twitterplugin = configOpts.widget.plugin.find(function(plugin) {
			return plugin.$.name == 'twitter-connect-plugin';
		});
		const twitterfabrickey = twitterplugin.variable.find(function(plugin) {
			return plugin.$.name == 'FABRIC_KEY';
		});
		twitterfabrickey.$.value = '';
}

function updateLinkedinConfig(configOpts) {
		// update plugin
		const linkedinplugin = configOpts.widget.plugin.find(function(plugin) {
			return plugin.$.name == 'cordova-plugin-linkedin';
		});
		const linkedinappid = linkedinplugin.variable.find(function(plugin) {
			return plugin.$.name == 'APP_ID';
		});
		linkedinappid.$.value = '';
}
