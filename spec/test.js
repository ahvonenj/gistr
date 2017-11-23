describe("gistr core", function() 
{
	var gistr = require('../lib/min/index-min.js');

	it("should find gistr", function()
	{
		expect(gistr).not.toBeUndefined();
	});
});

describe("gistr basic commands", function() 
{
	var gistr = require('../lib/min/index-min.js');
	console.log = jasmine.createSpy("log");

	it("should output usage information", function()
	{
		gistr.main();
		expect(console.log).toHaveBeenCalledWith('Usage: gistr -h');
	});

	it("should output help page", function()
	{
		gistr.help();
		expect(console.log).not.toBeNull('');
	});

	it("should output version", function()
	{
		gistr.version();
		expect(console.log).not.toBeNull('');
	});
});

describe("gistr gist commands", function()
{
	var gistr = require('../lib/min/index-min.js');
	console.log = jasmine.createSpy("log");

	it("should output message when there are no gists stored", function()
	{
		gistr.list();
		expect(console.log).toHaveBeenCalledWith('No gists stored');
	});
});