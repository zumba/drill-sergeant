var Github = require('github');
var _ = require('underscore');

var ghClient = new Github({
	version: '3.0.0',
	protocol: 'https'
});

ghClient.authenticate({
	type: 'oauth',
	token: process.env.GITHUB_TOKEN
});

ghClient.pullRequests.getAll({
	user: 'zumba',
	repo: 'public',
	state: 'open',
	per_page: 1
}, function(err, res) {
	if (err) {
		console.error(err);
	}
	_.each(res, function(data) {
		var created = new Date(data.created_at).getTime();
		var now = new Date().getTime();
		console.log(created, now, (now - created) / 1000 / 60 / 60);
		console.log({title: data.title, url: data.html_url, created: data.created_at});
	});
});
