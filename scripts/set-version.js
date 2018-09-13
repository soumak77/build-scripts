var util = require('util'),
		fs = require('fs'),
    path = require('path'),
		utils = require('./utils'),
    xml2js = require('xml2js'),
    packageVersion = require('../package.json').version,
    fileName = 'config.xml',
    filePath = './config.xml',
    platformVersion = false,
    incrementVersion = true;

var parser = new xml2js.Parser(),
    changeVersion,
    platformName,
    needRewrite = false;

var result = utils.readXmlSync(filePath);
parseConfig(result);

function parseConfig(configOpts) {
  if (platformVersion) {
    platforms.forEach(function (platform) {
      if(setPlatformInfo(platform))
        configOpts = handleResult(configOpts);
    });
  }
  if (incrementVersion) {
    changeVersion = 'version';
    platformName = 'App';
    configOpts = handleResult(configOpts);
  }

  if(needRewrite) {
		utils.writeXmlSync(filePath, configOpts);
    console.log('Saved in ' + fileName);
  } else {
    console.log(fileName + ' build numbers not changed');
  }
}

function setPlatformInfo(platform) {
  switch (platform) {
    case 'android':
      changeVersion = 'android-versionCode';
      platformName = 'Android';
      break;
    case 'ios':
      changeVersion = 'ios-CFBundleVersion';
      platformName = 'iOS';
      break;
    case 'osx':
      changeVersion = 'osx-CFBundleVersion';
      platformName = 'OS X';
      break;
    case 'windows':
      changeVersion = 'windows-packageVersion';
      platformName = 'Windows';
      break;
    default:
      console.log('This hook supports Android, iOS, OS X, and Windows currently, ' + platform + ' not supported');
      return false;
  }
  return true;
}

function handleResult(result) {
  var newVersion =  null;
  if(result.widget.$[changeVersion]) {
    newVersion = packageVersion;
    if (newVersion) {
			result.widget.$[changeVersion] = newVersion;
    } else {
			console.log(platformName + ' version code still "' + result.widget.$[changeVersion] + '"');
		}
  } else {
    console.log(platformName + ' version code not found');
  }

  if(newVersion) {
    needRewrite = true;
    console.log(platformName + ' build number incremented to "' + newVersion + '"');
  }

  return result;
}
