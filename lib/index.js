var test = function(str)
{
	return console.log(str);
}

var main = function()
{
	return console.log('gistr v1.0.0');
}

var execdir = function()
{
	return console.log(process.cwd());
}

var moduledir = function()
{
	return console.log(__dirname);
}

exports.test = test;
exports.main = main;
exports.execdir = execdir;
exports.moduledir = moduledir;