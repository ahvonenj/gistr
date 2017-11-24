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
				.pipe(fs.createWriteStream(process.cwd() + '/gistr-db-export.gs'));

				console.log('Database exported as a file to your cwd. Keep it safe somewhere.');
				console.log('NOTE: The database-file might include your Github access-token!');
				process.exit(0);
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


exports.wrap = function(g)
{
	g.exportDatabase = exportDatabase;
}