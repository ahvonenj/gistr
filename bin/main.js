#!/usr/bin/env node

var gistr = require('../lib/index.js');
var Settings = require('settings');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');


var config = new Settings(require('../lib/config.js'));

console.log(argv)

// Default command call without arguments
if(argv._.length === 0)
{
	gistr.main();
}
else
{
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

	var subcommand = argv._[0];

	switch(subcommand)
	{
		case 'execdir':
			gistr.execdir();
			break;
		case 'moduledir':
			gistr.moduledir();
			break;
		case 'settings':
			console.log(config);
			break;
		case 'create':
		case 'add':
			gistr.creategist(function(data, response)
			{
				fs.writeFile(process.cwd() + '/resp.json', JSON.stringify(data), function(err)
				{
					if(err) throw err;
				});
			});
			break;
		default:
			console.log('No such command `' + subcommand + '`');
			break;
	}
}