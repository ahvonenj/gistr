// REQUIRES

var columnify = require('columnify');
var Client = require('node-rest-client').Client;
var asyncLoop = require('node-async-loop');
var fs = require('fs');
var Storage = require('node-storage');
var fuzzy = require('fuzzy');


// VARIABLES

var Private = 
{
	version: '1.0.7',
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

var client = new Client();
var store = new Storage(__dirname + '/.gistr_storage');


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

var saveToken = function(argv)
{
	var token = argv.t || argv.token || null;

	if(token === null || token === "" || token.length === 0)
		return console.log('--token="" not supplied or it is invalid');

	store.put('access-token', token);

	console.log('Token saved');
}

var removeToken = function()
{
	if(typeof store.get('access-token') === 'undefined')
	{
		return console.log('No token saved');
	}
	else
	{
		store.remove('access-token');
		console.log('Token removed');
	}
}

var showToken = function()
{
	if(typeof store.get('access-token') === 'undefined')
		return console.log('No token saved');
	else
		return console.log(store.get('access-token'));
}


// ACTUAL PROGRAM

// Create gist
var creategist = function(argv)
{
	var gists = [];

	argv._ = argv._.slice(1);

	// User supplied to files to gist
	if(argv._.length === 0)
	{
		console.log('No files specified');
		process.exit(0);
	}

	// Bundle 1 or more files in a single gist
	if(argv.b || argv.bundle || argv._.length === 1)
	{
		var files = { };

		consoleLog('Packing file(s) for gist...', argv);

		// Loop files supplied as arguments
		asyncLoop(argv._, function(fileordirectory, next)
		{
			// Lstat the current file or directory to, well, see if it is a file or a directory
			fs.lstat(fileordirectory, function(err, stats)
			{
				if(err)
				{
					// File with supplied name does not exist in current folder
					if(err.code = 'ENOENT')
					{
						consoleLog(fileordirectory + ' does not exist, skipping', argv);
						next();
						return;
					}
					else
					{
						throw err;
						process.exit(1);
					}
				}

				// We only care about files, because we are trying to gist multiple named files
				if(stats.isFile())
				{
					var file = fileordirectory;

					// Read contents of the file as utf8 and save to gist after all files are processed
					fs.readFile(file, 'utf8', function(err, data)
					{
						if (err) throw err;

						files[fileordirectory] = 
						{
							content: data
						}

						next();
					});
				}
				else if(stats.isDirectory())
				{
					var directory = fileordirectory;
					console.log('Multiple directories not supported!');
					process.exit(1);
				}
				else
				{
					consoleLog(fileordirectory + ' is not a file, skipping', argv);
					next();
				}
			});
		}, function(err)
		{
			// All supplied files have been read to memory at this point
			if(err)
			{
				console.error(err.message);
				return;
			}

			// Did we even read any files?
			if(Object.keys(files).length === 0)
			{
				console.log('No files to gist');
			}
			else
			{
				consoleLog('Files packed', argv);
				consoleLog('Creating a gist...', argv);

				// Construct request payload
				var data = 
				{
					files: files
				}

				data.description = argv.d || argv.desc || argv.description || "";
				data.public = argv.p || argv.private || false;

				// Create a gist through Github API
				client.post(Github.url + '/gists', 
				{
					data: JSON.stringify(data),
					headers: Github.default_headers(argv)
				},
				function(data, response)
				{
					var gists = parseGistResponse(data, false);

					if(isRateLimited(gists))
					{
						console.log('You have hit the Github rate-limit, try again later');
						process.exit(1);
					}
					else
					{
						consoleLog('Files gisted!', argv);
						storeGists(gists);
					}

					// Debug Github API response
					/*fs.writeFile(process.cwd() + '/resp.json', JSON.stringify(data), function(err)
					{
						if(err) throw err;
					});*/
				})
			}
		});
	}
	else // Post gists separately
	{
		// We're making separate gists, so have to collect responses somewhere
		var gisted = [];
		var responses = [];

		// Loop supplied files
		asyncLoop(argv._, function(fileordirectory, next)
		{
			consoleLog('Gisting ' + fileordirectory + '...', argv);

			// Check file or directory
			fs.lstat(fileordirectory, function(err, stats)
			{
				if(err)
				{
					// File does not exist
					if(err.code = 'ENOENT')
					{
						consoleLog(fileordirectory + ' does not exist, skipping', argv);
						next();
						return;
					}
					else
					{
						throw err;
						process.exit(1);
					}
				}

				if(stats.isFile())
				{
					var file = fileordirectory;

					// Read the file
					fs.readFile(file, 'utf8', function(err, filedata)
					{
						if (err) throw err;

						// Construct request payload
						var data = { files: { } }

						data.files[file] = { content: filedata }
						data.description = argv.d || argv.desc || argv.description || "";
						data.public = argv.p || argv.private || false;

						// Create a gist
						client.post(Github.url + '/gists', 
						{
							data: JSON.stringify(data),
							headers: Github.default_headers(argv)
						},
						function(respdata, response)
						{
							consoleLog('Gisted ' + file, argv);

							// Collect response
							gisted.push(parseGistResponse(respdata));
							responses.push(response);

							next();
						})
					});
				}
				else if(stats.isDirectory())
				{
					var directory = fileordirectory;
					console.log('Multiple directories not supported!');
					process.exit(1);
				}
				else
				{
					consoleLog(fileordirectory + ' is not a file, skipping', argv);
					next();
				}
			});
		}, function(err)
		{
			if(err)
			{
				console.error(err.message);
				return;
			}

			if(isRateLimited(gisted))
			{
				console.log('You have hit the Github rate-limit, try again later');
				process.exit(1);
			}
			else
			{
				consoleLog('Files gisted!', argv);
				storeGists(gisted);
			}

			// Debug Github API response
			/*fs.writeFile(process.cwd() + '/resp.json', JSON.stringify(gisted), function(err)
			{
				if(err) throw err;
			});*/
		});
	}
}

var listGists = function(argv, gists)
{

	if(typeof gists === 'undefined' && typeof store.get('gists') === 'undefined')
		return console.log('No gists stored');

	var gists = gists || store.get('gists');
	var tolist = [];

	for(var i = 0; i < gists.length; i++)
	{
		var gist = gists[i];
		var listitem = { };

		listitem['#'] = (typeof gist.idx !== 'undefined' ? gist.idx : i);
		//listitem['id'] = gist.id;
		listitem['desc'] = gist.description;
		//listitem['url'] = gist.url;
		//listitem['html_url'] = gist.html_url;
		listitem['created_at'] = gist.created_at;
		listitem['auth'] = gist.authenticated;

		var files = gist.files;

		listitem['files'] = Object.keys(files).join('\n');

		tolist.push(listitem);
	}

	return console.log(columnify(tolist, { preserveNewLines: true }));
}

var findGist = function(argv)
{
	if(typeof store.get('gists') === 'undefined')
		return console.log('No gists stored');

	var gists = store.get('gists');

	var options = 
	{
		extract: function(el) 
		{
			return (el.description.length > 0 ? el.description + '|' : '') + Object.keys(el.files).join('|');
		}
	}

	var results = fuzzy.filter(argv._[1], gists, options);
	var matches = results.map(function(el) { return el.string; });
	var matchedgists = results.map(function(el) { el.original.idx = el.index; return el.original; });

	listGists(null, matchedgists);
}

var showGist = function(argv)
{

}

var pullGist = function(argv)
{

}

// Parse and clean whatever Github's Gist-API returns
// We want to leave out contents of files and other useless information to save space
var parseGistResponse = function(response, stringify)
{
	stringify = stringify || false;

	try
	{
		var resp = JSON.parse(response);
	}
	catch(err)
	{
		var resp = response;
	}

	var files = { };

	for(var key in resp.files)
	{
		if(!resp.files.hasOwnProperty(key))
			continue;

		var file = resp.files[key];

		files[key] =
		{
			filename: file.filename,
			type: file.type,
			language: file.language,
			raw_url: file.raw_url,
			size: file.size
		}
	}

	var gist = 
	{ 
		id: resp.id,
		url: resp.url,
		html_url: resp.html_url,
		created_at: resp.created_at,
		description: resp.description,
		authenticated: (typeof resp.owner === 'undefined' ? false : true),
		files: files
	};

	if(stringify)
		return JSON.stringify(gist);
	else
		return gist;
}

var isRateLimited = function(gists)
{
	if(Array.isArray(gists))
	{
		for(var i = 0; i < gists.length; i++)
		{
			var gist = gists[i];
			
			if(Object.keys(gist.files).length === 0)
				return true;
		}

		return false;
	}
	else
	{
		if(Object.keys(gists.files).length === 0)
			return true;
		else
			return false;
	}
}


// Helper function for verbose logging
var consoleLog = function(str, argv)
{
	verbose = argv.v || argv.verbose || false;

	if(verbose)
		console.log(str);
}


// Gist storage functions
var storeGists = function(gists)
{
	// Storage does not have any gists stored
	if(typeof store.get('gists') === 'undefined')
	{
		// Are we storing multiple gists
		if(Array.isArray(gists))
		{
			store.put('gists', gists);
		}
		else
		{
			store.put('gists', [gists]);
		}
	}
	else
	{
		// There are some gists stored, so have to fetch those
		var savedgists = store.get('gists');
		
		// If we are storing multiple new gists, we need to add them all to the array of previously stored
		if(Array.isArray(gists))
		{
			for(var i = 0; i < gists.length; i++)
			{
				savedgists.push(gists[i]);
			}
		}
		else
		{
			savedgists.push(gists);
		}

		// Update stored gists
		store.put('gists', savedgists);
	}
}




// EXPORTS

// Main
exports.main = main;

// Help
exports.help = help;

// Create gist
exports.creategist = creategist;
exports.add = creategist;
exports.create = creategist;

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