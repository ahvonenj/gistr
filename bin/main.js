#!/usr/bin/env node

var gistr = require('../lib/index-min.js');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

// Print out gistr version, if -v or --version argument exists
if((argv.v || argv.version) && argv._.length === 0)
{
	gistr.version();
	process.exit(0);
}
else if((argv.h || argv.help) && argv._.length === 0) // Print out help if -h or --help argument exists
{
	gistr.help();
	process.exit(0);
}
else if(argv._.length === 0) // If the whole command was only "gistr", we call some main qistr function
{
	gistr.main();
}
else
{
	// We just half-blindly call whichever subcommand the user wants to call
	// by checking is gistr exports has such function for some subcommand exposed
	var subcommand = argv._[0];

	if(typeof gistr[subcommand] !== 'undefined')
	{
		gistr[subcommand](argv);
	}
	else
	{
		// For example "gistr asdfg" would trigger this, as gistr.exports does not expose function with a name "asdfg"
		console.log('No such command `' + subcommand + '`');
		process.exit(0);
	}
}