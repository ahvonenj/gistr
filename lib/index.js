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
global.path = require('path');
global.fileExists = require('file-exists');
global.yesno = require('yesno');

// VARIABLES

global.Private = 
{
	version: '2.0.0',
	catchphrases:
	[
		'because you\'re worth it',
		'power to the gists',
		'snippety-snap',
		'gistiful!',
		'push, pull, push, pull, ...'
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
require('./database-min.js').wrap(global);
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
		'gist add <file1> ... [-b] [-d=""]': 'Gist one or multiple files',
		'gist add-dir <dir> [-d=""]': 'Gist a directory',
		'gist list': 'List all locally stored gists',
		'gist find <search>': 'Search stored gists by desc. or filename',
		'gist show <Gist #> [--tofile]': 'Output full details of a locally saved gist',
		'gist pull <Gist #> [-d=""]': 'Pull a gist from Github\'s Gists',
		'gist add-token <--token="">': 'Save your Github access-token',
		'gist remove-token': 'Remove saved Github access-token',
		'gist show-token': 'Show saved Github access-token',
		'gist version': 'Output current version',
		'gist help': 'What you\'re reading right now'
	},
	{
		columns: ['CMD', 'DESC']
	});

	console.log(out);
	console.log('For detailed help, visit: https://www.npmjs.com/package/gistr');
	return;
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


// Create gist from folder
exports['add-dir'] = createFolderGist;
exports['add-folder'] = createFolderGist;
exports['add-directory'] = createFolderGist;


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
exports["set-token"] = saveToken;

exports["remove-token"] = removeToken;
exports["delete-token"] = removeToken;
exports["unset-token"] = removeToken;

exports["show-token"] = showToken;
exports["display-token"] = showToken;
exports["view-token"] = showToken;


// Database
exports["export-db"] = exportDatabase;

exports["import-db"] = importDatabase;
exports["get-db"] = importDatabase;

exports["purge-db"] = clearDatabase;
exports["remove-db"] = clearDatabase;
exports["delete-db"] = clearDatabase;