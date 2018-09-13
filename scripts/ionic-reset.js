var nrc = require('node-run-cmd');
var fs = require('fs');
var build = process.argv.length > 2 ? process.argv[2] : 'local';
var platform = process.argv.length > 3 ? process.argv[3] : 'browser';
var notes = null;
var updateHrefOnly = false;

try {
  notes = require('../buildnotes.json');
} catch (e) {
  // buildnotes.json won't exist on first build
  console.log("No buildnotes.json file found");
}

var buildChanged = !notes || notes.build !== build;
if (buildChanged && notes) {
  if (notes.build === 'local' && build === 'debug') {
    updateHrefOnly = true;
  } else if (notes.build === 'debug' && build === 'local') {
    updateHrefOnly = true;
  }
}
var platformChanged = !notes || notes.platform !== platform;
var commands = [];
commands.push('npm run clean');
commands.push(`node scripts/set-version.js`);

if (updateHrefOnly && !platformChanged) {
  commands.push(`node scripts/config-environment.js ${build} ${platform}`);
  commands.push(`node scripts/set-base-href.js ${build} ${platform}`);
  commands.push(`node scripts/cache-bust.js ${build} ${platform}`);
} else if (buildChanged || platformChanged) {
  commands.push('rm -r platforms');
  commands.push('rm -r plugins');
  commands.push(`node scripts/set-credentials.js ${build} ${platform}`);
  commands.push(`node scripts/config-environment.js ${build} ${platform}`);
  commands.push(`cordova platform add ${platform} --nosave --nofetch`);
  commands.push(`node scripts/config-signing.js ${build} ${platform}`);
  commands.push(`node scripts/set-base-href.js ${build} ${platform}`);
  commands.push(`node scripts/cache-bust.js ${build} ${platform}`);
}

nrc.run(commands, {
  verbose: true
}).then(() => {
  notes = {
    build: build,
    platform: platform
  };
  fs.writeFile('./buildnotes.json', JSON.stringify(notes, null, 2), function(err) {
			if(err) throw err;
	});
});
