// REQUIRES

var columnify = require('columnify');
var Client = require('node-rest-client').Client;


// VARIABLES

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

var Github = 
{
	url: 'https://api.github.com',
	default_headers:
	{
		'User-Agent': 'Gistr v' + Private.version
	}
}

var client = new Client();


// MAIN AND HELP

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


// ACTUAL PROGRAM

var creategist = function(callback, description, public, files)
{
	var _callback = callback || function() { };
	var _description = description || '';
	var _public = public || true;

	var _files = 
	{
		'test.txt':
		{
			content: 'test content ' + Math.floor(Math.random() * 100000).toString()
		}
	}

	client.post(Github.url + '/gists', 
	{
		data: JSON.stringify(
		{
			files: _files
		}),
		headers: Github.default_headers
	},
	function(data, response)
	{
		_callback(data, response);
	})
}







exports.test = test;
exports.main = main;
exports.execdir = execdir;
exports.moduledir = moduledir;
exports.help = help;
exports.creategist = creategist;