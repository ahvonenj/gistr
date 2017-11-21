#!/usr/bin/env node

var gistr = require('../lib/index.js');
var Settings = require('settings');
var argv = require('minimist')(process.argv.slice(2));


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
		default:
			console.log('No such command `' + subcommand + '`');
			break;
	}
}