describe("Core", function() 
{
	var gistr = require('../lib/index.js');

	it("should find gistr", function()
	{
		expect(gistr).not.toBeUndefined();
	});
});

describe("gistr basic commands", function() 
{
	var gistr = require('../lib/index.js');
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