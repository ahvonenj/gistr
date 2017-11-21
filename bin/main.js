#!/usr/bin/env node

var gistr = require('../lib/index.js');
var Settings = require('settings');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');


var config = new Settings(require('../lib/config.js'));

//console.log(argv)

// Default command call without arguments
if(argv.v)
{
	gistr.version();
	process.exit(0);
}
else if(argv.h)
{
	gistr.help();
	process.exit(0);
}
else if(argv._.length === 0)
{
	gistr.main();
}
else
{
	var subcommand = argv._[0];

	if(typeof gistr[subcommand] !== 'undefined')
	{
		gistr[subcommand](argv);
	}
	else
	{
		console.log('No such command `' + subcommand + '`');
		process.exit(0);
	}

	/*
		gistr.creategist(function(data, response)
		{
			fs.writeFile(process.cwd() + '/resp.json', JSON.stringify(data), function(err)
			{
				if(err) throw err;
			});
		});
	*/
}