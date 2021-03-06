// Create gist
var createGist = function(argv, nostore, callback)
{
	nostore = nostore || false;
	callback = callback || function() { };

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
					var filename = path.basename(file);

					// Read contents of the file as utf8 and save to gist after all files are processed
					fs.readFile(file, 'utf8', function(err, data)
					{
						if (err) throw err;

						files[filename] = 
						{
							content: data
						}

						next();
					});
				}
				else if(stats.isDirectory())
				{
					var directory = fileordirectory;
					console.log('To gist directories, use gist add-dir <directory>');
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

					if(response.headers.status.indexOf('401') !== -1)
					{
						console.log('Github returned 401 Unauthorized - there might be a problem with your access-token');
						process.exit(1);
					}
					else if(isRateLimited(gists))
					{
						console.log('You have hit the Github rate-limit, try again later');
						process.exit(1);
					}
					else // 201 Created
					{
						consoleLog('Files gisted!', argv);

						if(!nostore)
							storeGists(gists);
						else
							callback(gists);
					}
				});
			}
		});
	}
	else // Post gists separately
	{
		// We're making separate gists, so have to collect responses somewhere
		var gisted = [];

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
					var filename = path.basename(file);

					// Read the file
					fs.readFile(file, 'utf8', function(err, filedata)
					{
						if (err) throw err;

						// Construct request payload
						var data = { files: { } }

						data.files[filename] = { content: filedata }
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

							if(response.headers.status.indexOf('401') !== -1)
							{
								console.log('Github returned 401 Unauthorized - there might be a problem with your access-token');
								process.exit(1);
							}

							// 201 Created

							// Collect response
							gisted.push(parseGistResponse(respdata));

							next();
						})
					});
				}
				else if(stats.isDirectory())
				{
					var directory = fileordirectory;
					console.log('To gist directories, use gist add-dir <directory>');
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

				if(!nostore)
					storeGists(gisted);
				else
					callback(gisted);
			}
		});
	}
}

var createFolderGist = function(argv)
{
	argv._ = argv._.slice(1);

	console.log(argv);

	// User supplied to files to gist
	if(argv._.length === 0)
	{
		console.log('No folder specified');
		process.exit(0);
	}

	var directory = argv._[0];

	// Lstat the directory
	fs.lstat(directory, function(err, stats)
	{
		if(err)
		{
			// Directory does not exist
			if(err.code = 'ENOENT')
			{
				consoleLog(directory + ' does not exist', argv);
				process.exit(1);
			}
			else
			{
				throw err;
				process.exit(1);
			}
		}

		// Is it even a directory?
		if(stats.isDirectory())
		{
			// Read directory contents
			fs.readdir(directory, function(err, files)
			{
				// Add directory path to files
				files = files.map(function(f) { return directory + '/' + f; });

				// We want to reuse createGist by making our own mock-argv
				// createGist works with multiple files, but not for folders
				// so we just turn the folder contents into multiple files
				var argv_mock =
				{
					_: [null].concat(files) // First array index gets sliced by createGist, so have to give it something
				};

				// Copy original argv arguments to our mock-argv
				for(var k in argv)
				{
					if(!argv.hasOwnProperty(k))
						continue;

					if(k === '_')
						continue;

					argv_mock[k] = argv[k];
				}
				
				// Force set bundle and b -parameters to true, so the user doesn't
				// accidentally gist 9001 files separately and burn their rate-limit
				argv_mock.bundle = true;
				argv_mock.b = true;

				createGist(argv_mock);
			})
		}
	});
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

	// Options-object for fuzzy-search
	var options = 
	{
		// Extract file description and all files names as concatenated string for fuzzy search
		extract: function(el) 
		{
			return (el.description.length > 0 ? el.description + '|' : '') + Object.keys(el.files).join('|');
		}
	}

	// Fuzzy search results
	var results = fuzzy.filter(argv._[1], gists, options);

	// Fuzzy character matches
	var matches = results.map(function(el) { return el.string; });

	// Actual gist-results
	var matchedgists = results.map(function(el) { el.original.idx = el.index; return el.original; });

	// List matched results
	listGists(null, matchedgists);
}

var showGist = function(argv)
{
	var gist = getGistOrDie(argv);
	var filesString = '';

	// Loop trough files of this gist and build a string out of them
	for(var key in gist.files)
	{
		if(!gist.files.hasOwnProperty(key))
			continue;

		var file = gist.files[key];

		filesString += '\r\n\r\n' + 
		'\r\n' + file.filename +
		'\r\n\r\nTYPE: ' + file.type +
		'\r\nLANG: ' + file.language +
		'\r\nRAW: ' + file.raw_url +
		'\r\nSIZE: ' + file.size;
	}

	// Output gist details to console or to file
	if(argv.tofile)
	{
		var filename = 'gist-' + gist.id + '.txt';

		// Need to use \r\n for file newlines (on Windows)
		fs.writeFile(process.cwd() + '/' + filename, 
		'ID: ' + gist.id +
		'\r\nURL: ' + gist.url +
		'\r\nHTML URL: ' + gist.html_url +
		'\r\nCREATED: ' + gist.created_at +
		'\r\nDESC: ' + gist.description +
		'\r\nAUTH: ' + gist.authenticated +
		'\r\nFILES: ' + filesString, 
		function(err)
		{
			if(err) throw err;
			console.log('Created file ' + process.cwd() + '\\' + filename);
		});
	}
	else
	{
		console.log('ID: ' + gist.id +
					'\nURL: ' + gist.url +
					'\nHTML URL: ' + gist.html_url +
					'\nCREATED: ' + gist.created_at +
					'\nDESC: ' + gist.description +
					'\nAUTH: ' + gist.authenticated +
					'\nFILES: ' + filesString
		);
	}
}

var pullGist = function(argv)
{
	var gist = getGistOrDie(argv);
	var files = [];

	for(var key in gist.files)
	{
		if(!gist.files.hasOwnProperty(key))
			continue;

		var file = gist.files[key];

		files.push(file);
	}

	var dir = argv.d || argv.dir || argv.directory || '';
	dir = process.cwd() + '/' + dir;

	mkdirp(dir, function (err) 
	{
	    if (err)
	    {
	    	console.error(err);
	    	process.exit(1);
	    }

	    asyncLoop(files, function(file, next)
	    {
	    	download(file.raw_url.toString()).then(function(data)
	    	{
	    	    fs.writeFile(dir + '/' + file.filename, data, function(err)
	    		{
	    			if(err) next(err);

	    			consoleLog('Pulled file ' + file.filename, argv);
	    			next();
	    		});
	    	});
	    }, function(err)
	    {
	    	if(err)
	    	{
	    		console.error(err.message);
	    		return;
	    	}

	    	consoleLog('Gist pulled', argv);
	    });
	    
	});
}

var pullGistById = function(id, argv, callback)
{
	callback = callback || function() { }

	consoleLog('Pulling gist ' + id, argv);

	client.get(Github.url + '/gists/' + id, 
	{
		headers: Github.default_headers(argv)
	},
	function(respdata, response)
	{
		if(response.headers.status.indexOf('404') !== -1)
		{
			console.log('Github returned 404 Not Found - there might be a problem with the supplied Gist ID');
			process.exit(1);
		}
		else if(response.headers.status.indexOf('200') === -1)
		{
			console.log('Unknown response (' + response.headers.status + ')');
			process.exit(1);
		}

		consoleLog('Pulled gist ' + id, argv);

		// Collect response
		var gist = parseGistResponse(respdata, false);
		
		callback(gist)
	});
}

exports.wrap = function(g)
{
	g.createGist = createGist;
	g.createFolderGist = createFolderGist;
	g.listGists = listGists;
	g.findGist = findGist;
	g.showGist = showGist;
	g.pullGist = pullGist;
	g.pullGistById = pullGistById;
}