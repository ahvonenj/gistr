var exportDatabase = function(argv)
{
	if(typeof store.get('gists') === 'undefined')
		return console.log('No database to export');

	var gists = store.get('gists');

	if(argv.f || argv.tofile)
	{
		consoleLog('Exporting local database to a file', argv);

		fileExists(__dirname + '/.gistr_storage', function(err, exists)
		{
			if(err) throw err;

			if(exists)
			{
				fs.createReadStream(__dirname + '/.gistr_storage')
				.pipe(fs.createWriteStream(process.cwd() + '/gistr-db-export.gs'))
				.on('finish', function()
				{
					console.log('Database exported as a file to your cwd. Keep it safe somewhere.');
					console.log('NOTE: The database-file might include your Github access-token!');
				});
			}
			else
			{
				console.log('Storage file not found');
				process.exit(1);
			}
		});
	}
	else
	{
		consoleLog('Exporting local database as a gist', argv);

		if(typeof store.get('access-token') === 'undefined')
		{
			console.log('Database can only be exported as a gist, if access-token in set');
			process.exit(1);
		}

		var argv_mock = 
		{
			_: [null, __dirname + '/.gistr_storage'],
			d: 'gstr database export (WARNING: This gist contains your Github access-token!)'
		}

		createGist(argv_mock, true, function(data)
		{
			var gistId = data.id;
			console.log('Database saved as a gist to your Github profile');
			console.log('To import database, save and use this gist ID or use the gisted file in your Github profile');
			console.log('Gist ID: ' + gistId);
		});
	}
}

var importDatabase = function(argv)
{
	yesno.ask('WARNING: This will overwrite the current database, continue?', null, function(ok)
	{
		if(!ok)
			process.exit(0);
		
		if(argv.id)
		{
			pullGistById(argv.id, argv, function(gist)
			{
				var raw_url = gist.files[Object.keys(gist.files)[0]].raw_url;

				download(raw_url).then(function(data)
				{
					try
					{
						var json = JSON.parse(data.toString());
					}
					catch(parseException)
					{
						console.log('Pulled gist does not seem to be a gister storage-file');
						process.exit(1);
					}

					if(typeof json.gists === 'undefined')
					{
						console.log('Pulled gist does not seem to be a gister storage-file');
						process.exit(1);
					}

				    fs.writeFile(__dirname + '/.gistr_storage', data, function(err)
					{
						if(err) next(err);

						global.store = new Storage(__dirname + '/.gistr_storage');

						consoleLog('Imported .gistr_storage from Github', argv);
						process.exit(0);
					});
				});
			});
		}
		else if(argv.f || argv.file)
		{
			if(typeof argv.f === 'boolean' || typeof argv.file === 'boolean')
				var file = process.cwd() + '/gistr-db-export.gs';
			else
				var file = argv.f || argv.file;

			fileExists(file, function(err, exists)
			{
				if(err) throw err;

				if(exists)
				{
					fs.readFile(file, function(err, filedata)
					{
						if (err) throw err;

						try
						{
							var json = JSON.parse(filedata);
						}
						catch(parseException)
						{
							console.log('Supplied file does not seem to be a gister storage-file or it does not contain anything');
							process.exit(1);
						}

						if(typeof json.gists === 'undefined')
						{
							console.log('Supplied file does not seem to be a gister storage-file or it does not contain anything');
							process.exit(1);
						}

						fs.createReadStream(file)
						.pipe(fs.createWriteStream(__dirname + '/.gistr_storage'))
						.on('finish', function()
						{
							global.store = new Storage(__dirname + '/.gistr_storage');

							console.log('Database imported from file.');
							process.exit(0);
						});
					});
					
				}
				else
				{
					console.log('Storage file not found');
					process.exit(1);
				}
			});
		}
		else
		{
			console.log('Command needs to be called with --id="<gist id>" or --file="<pathToFile>"');
			process.exit(1);
		}
	});
}

var clearDatabase = function(argv)
{
	yesno.ask('WARNING: This will completely remove the local database, continue?', null, function(ok)
	{
		if(!ok)
			process.exit(0);

		if(typeof store.get('gists') === 'undefined')
		{
			console.log('No database to purge');
			process.exit(1);
		}

		fileExists(__dirname + '/.gistr_storage', function(err, exists)
		{
			if(err) throw err;

			if(exists)
			{
				fs.unlink(__dirname + '/.gistr_storage', function(err)
				{
					if(err)
					{
						console.log('Could not purge database (filesystem error)');
						throw err;
					}

					global.store = new Storage(__dirname + '/.gistr_storage');

					console.log('Database purged');
					process.exit(0);
				});
			}
			else
			{
				console.log('No database to purge');
				process.exit(1);
			}
		});
	});
}

exports.wrap = function(g)
{
	g.exportDatabase = exportDatabase;
	g.importDatabase = importDatabase;
	g.clearDatabase = clearDatabase;
}