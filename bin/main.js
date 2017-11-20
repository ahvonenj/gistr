#!/usr/bin/env node

var fget = require('../lib/index.js');


var args = process.argv.splice(process.execArgv.length + 2);

// Default command call without arguments
if(typeof args[0] === 'undefined' || args[0] === null)
{
	fget.main();
}
else
{
	var subcommand = args[0];

	switch(subcommand)
	{
		case 'execdir':
			fget.execdir();
			break;
		case 'moduledir':
			fget.moduledir();
			break;
		default:
			console.log('No such command `' + subcommand + '`');
			break;
	}
}