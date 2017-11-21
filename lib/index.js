var columnify = require('columnify');

var Private = 
{
	version: '1.0.1',
	catchphrases:
	[
		'because you\'re worth it',
		'power to the gists',
		'snippety-snap',
		'gistiful!'
	]
}


var test = function(str)
{
	return console.log(str);
}

var main = function()
{
	return help();
}

var version = function()
{
	return console.log('gistr v' + Private.version);
}

var help = function()
{
	var out = 'gistr - ' + 
	Private.catchphrases[Math.floor(Math.random() * Private.catchphrases.length)] + 
	'\n\n' + 
	columnify(
	{
		'execdir': 'Output current executing directory',
		'moduledir': 'Output current module directory'
	},
	{
		columns: ['CMD', 'DESC']
	});

	return console.log(out);
}

var execdir = function()
{
	return console.log(process.cwd());
}

var moduledir = function()
{
	return console.log(__dirname);
}

exports.test = test;
exports.main = main;
exports.execdir = execdir;
exports.moduledir = moduledir;