var command = require('commander'),
	pkg = require('./package.json'),
	github = require('./lib/github'),
	stalerepos = require('./lib/stalerepos'),
	email = require('./lib/email');

var ghClient, repos, mail;

process.title = 'drillsergeant';

command
	.version(pkg.version)
	.option('-r, --repo [user/repository]', 'Define the [comma delimited] repositories to check PRs.')
	.option('-e, --email [email@address]', 'Set the [comma delimited] email address(es) to be notified.')
	.option('-s, --staletime [number of hours]', 'Set the PR stale threshold. (default: 24)', 24)
	.parse(process.argv);

if (!process.env.GITHUB_TOKEN) {
	console.error('GITHUB_TOKEN is required.');
	process.exit(1);
}

if (!command.repo) {
	console.error('Repo argument must be provided.');
	process.exit(1);
}

if (!command.email) {
	console.error('Email argument must be provided.');
	process.exit(1);
}

repos = command.repo.split(',');

ghClient = new github(process.env.GITHUB_TOKEN);
mail = new email(command.email);

stalerepos.retrieve(repos, ghClient, command.staletime, function(results) {
	mail.notify(results);
});
