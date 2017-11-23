// REQUIRES

global.columnify = require('columnify');
global.Client = require('node-rest-client').Client;
global.asyncLoop = require('node-async-loop');
global.fs = require('fs');
global.Storage = require('node-storage');
global.fuzzy = require('fuzzy');
global.util = require('util');
global.download = require('download');
global.mkdirp = require('mkdirp');

// VARIABLES

global.Private = 
{
	version: '1.1.2',
	catchphrases:
	[
		'because you\'re worth it',
		'power to the gists',
		'snippety-snap',
		'gistiful!'
	]
}

global.Github = 
{
	url: 'https://api.github.com',
	default_headers: function(argv)
	{
		var headers = 
		{
			'User-Agent': 'Gistr v' + Private.version
		}

		if(typeof store.get('access-token') !== 'undefined')
		{
			consoleLog('Gisting with a saved token', argv);
			headers['Authorization'] = 'token ' + store.get('access-token');
		}
		else
		{
			consoleLog('Gisting without saved token', argv);
		}

		return headers;
	}
}

global.client = new Client();
global.store = new Storage(__dirname + '/.gistr_storage');


// INTERNAL REQUIRES

require('./util-min.js').wrap(global);
require('./token-min.js').wrap(global);
require('./gist-min.js').wrap(global);

// MAIN 

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


// EXPORTS

// Main
exports.main = main;

// Help
exports.help = help;

// Create gist
exports.creategist = createGist;
exports.add = createGist;
exports.create = createGist;

// Version
exports.version = version;

// Gists
exports.list = listGists;
exports.gists = listGists;

exports.find = findGist;
exports.search = findGist;

exports.show = showGist;
exports.details = showGist;

exports.pull = pullGist;
exports.get = pullGist;

// Token
exports["save-token"] = saveToken;
exports["add-token"] = saveToken;

exports["remove-token"] = removeToken;
exports["delete-token"] = removeToken;

exports["show-token"] = showToken;
exports["display-token"] = showToken;