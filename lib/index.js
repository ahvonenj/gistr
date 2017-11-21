// REQUIRES

var columnify = require('columnify');
var Client = require('node-rest-client').Client;


// VARIABLES

var Private = 
{
	version: '1.0.2',
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

var main = function()
{
	return console.log('Usage: gistr -h');
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

var creategist = function(argv)
{
	console.log(argv)

	/*var _callback = callback || function() { };
	var _description = description || '';
	var _public = public || true;

	var _files = files;

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
	})*/
}





// EXPORTS

// Main
exports.main = main;

// Dir
//exports.execdir = execdir;
//exports.moduledir = moduledir;

// Help
exports.help = help;

// Create gist
exports.creategist = creategist;
exports.add = creategist;
exports.create = creategist;

// Version
exports.version = version;