// REQUIRES

var columnify = require('columnify');
var Client = require('node-rest-client').Client;
var asyncLoop = require('node-async-loop');
var fs = require('fs');


// VARIABLES

var Private = 
{
	version: '1.0.3',
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
	var gists = [];

	argv._ = argv._.slice(1);

	if(argv._.length === 0)
	{
		console.log('No files specified');
		process.exit(0);
	}

	// Bundle files in a single gist
	if(argv.b || argv.bundle || argv._.length === 1)
	{
		var files = { };

		consoleLog('Packing file(s) for gist...', argv.verbose);

		asyncLoop(argv._, function(fileordirectory, next)
		{
			fs.lstat(fileordirectory, function(err, stats)
			{
				if(err)
				{
					if(err.code = 'ENOENT')
					{
						consoleLog(fileordirectory + ' does not exist, skipping', argv.verbose);
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
					consoleLog(fileordirectory + ' is not a file, skipping', argv.verbose);
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

			if(Object.keys(files).length === 0)
			{
				console.log('No files to gist');
			}
			else
			{
				consoleLog('Files packed', argv.verbose);
				consoleLog('Creating a gist...', argv.verbose);

				var data = 
				{
					files: files
				}

				data.description = argv.d || argv.desc || argv.description || "";
				data.public = argv.p || argv.private || false;

				client.post(Github.url + '/gists', 
				{
					data: JSON.stringify(data),
					headers: Github.default_headers
				},
				function(data, response)
				{
					console.log('Files gisted!');

					fs.writeFile(process.cwd() + '/resp.json', parseGistResponse(data, true), function(err)
					{
						if(err) throw err;
					});
				})
			}
		});
	}
	else // Post gists separately
	{
		var gisted = [];

		asyncLoop(argv._, function(fileordirectory, next)
		{
			consoleLog('Gisting ' + fileordirectory + '...', argv.verbose);

			fs.lstat(fileordirectory, function(err, stats)
			{
				if(err)
				{
					if(err.code = 'ENOENT')
					{
						consoleLog(fileordirectory + ' does not exist, skipping', argv.verbose);
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

					fs.readFile(file, 'utf8', function(err, filedata)
					{
						if (err) throw err;

						var data = { files: { } }

						data.files[file] = { content: filedata }
						data.description = argv.d || argv.desc || argv.description || "";
						data.public = argv.p || argv.private || false;

						client.post(Github.url + '/gists', 
						{
							data: JSON.stringify(data),
							headers: Github.default_headers
						},
						function(respdata, response)
						{
							consoleLog('Gisted ' + file, argv.verbose);

							gisted.push(parseGistResponse(respdata));
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
					consoleLog(fileordirectory + ' is not a file, skipping', argv.verbose);
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

			console.log('Files gisted!');

			fs.writeFile(process.cwd() + '/resp.json', JSON.stringify(gisted), function(err)
			{
				if(err) throw err;
			});
		});
	}
}

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
		files: files
	};

	if(stringify)
		return JSON.stringify(gist);
	else
		return gist;
}

var consoleLog = function(str, verbose)
{
	verbose = verbose || false;

	if(verbose)
		console.log(str);
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