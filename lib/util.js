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

var getGistOrDie = function(argv)
{
	// Check if gist # is given
	if(typeof argv === 'undefined' || typeof argv._[1] === 'undefined' || argv._[1] === '')
	{
		if(typeof argv.id === 'undefined' || argv.id === '')
		{
			console.log('Gist # not supplied');
			process.exit(1);
		}
		else
		{
			var id = parseInt(argv.id);
		}
	}
	else
	{
		var id = parseInt(argv._[1]);
	}

	// Gist # given is a string
	if(isNaN(id))
	{
		console.log('Gist # is not a number');
		process.exit(1);
	}

	// No gists stored
	if(typeof store.get('gists') === 'undefined')
	{
		console.log('No gists stored');
		process.exit(1);
	}

	var gists = store.get('gists');

	// No gist found for given #
	if(typeof gists[id] === 'undefined')
	{
		console.log('Gist ' + id + ' does not exist');
		process.exit(1);
	}

	return gists[id];
}

exports.wrap = function(g)
{
	g.parseGistResponse = parseGistResponse;
	g.isRateLimited = isRateLimited;
	g.consoleLog = consoleLog;
	g.storeGists = storeGists;
	g.getGistOrDie = getGistOrDie;
}