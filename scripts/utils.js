var xml2js = require('xml2js');
var fs = require('fs');

function buildXml(obj) {
  var builder = new xml2js.Builder();
  builder.options.xmldec.standalone = null;
  builder.options.renderOpts.pretty = true;
  builder.options.renderOpts.spacebeforeslash = ' ';
  builder.options.renderOpts.indent = '    ';
  var x = builder.buildObject(obj);
  return x.toString();
}

function readXml(filepath, cb) {
	fs.readFile(filepath, { encoding:'utf8' }, function(err, data) {
    if(err) throw err;
    var parser = new xml2js.Parser({
      async: true
    });
    parser.parseString(data, function (err, result) {
      if(err) throw err;
      cb(result);
    });
	});
}

function readXmlSync(filepath) {
	var data = fs.readFileSync(filepath, { encoding:'utf8' });
  var parser = new xml2js.Parser({
    async: false
  });
  var result;
  parser.parseString(data, function (err, res) {
    if(err) throw err;
    result = res;
  });
  return result;
}

function writeXml(filepath, xml, cb) {
  fs.writeFile(filepath, buildXml(xml), function(err) {
      if(err) throw err;
      if (cb) { cb(); }
  });
}

function writeXmlSync(filepath, xml) {
  fs.writeFileSync(filepath, buildXml(xml));
}

function writePackageJson(json) {
  fs.writeFile('./package.json', JSON.stringify(json, null, '  '), function(err) {
			if(err) throw err;
	});
}

function writePackageJsonSync(json) {
  fs.writeFileSync('./package.json', JSON.stringify(json, null, '  '));
}

module.exports = {
  buildXml: buildXml,
  readXml: readXml,
  readXmlSync: readXmlSync,
  writeXml: writeXml,
  writeXmlSync: writeXmlSync,
  writePackageJson: writePackageJson,
  writePackageJsonSync: writePackageJsonSync
};
