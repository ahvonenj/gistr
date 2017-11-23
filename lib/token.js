var saveToken = function(argv)
{
	var token = argv.t || argv.token || null;

	if(token === null || token === "" || token.length === 0)
		return console.log('--token="" not supplied or it is invalid');

	store.put('access-token', token);

	console.log('Token saved');
}

var removeToken = function()
{
	if(typeof store.get('access-token') === 'undefined')
	{
		return console.log('No token saved');
	}
	else
	{
		store.remove('access-token');
		console.log('Token removed');
	}
}

var showToken = function()
{
	if(typeof store.get('access-token') === 'undefined')
		return console.log('No token saved');
	else
		return console.log(store.get('access-token'));
}

exports.wrap = function(g)
{
	g.saveToken = saveToken;
	g.removeToken = removeToken;
	g.showToken = showToken;
}