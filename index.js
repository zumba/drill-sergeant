var command = require('commander'),
	pkg = require('./package.json'),
	github = require('./lib/github'),
	stalerepos = require('./lib/stalerepos'),
	notifiers = {
		email: require('./lib/notifiers/email'),
		github: require('./lib/notifiers/github')
	},
	notify = require('./lib/notify');

var ghClient, repos, mail;

process.title = 'drillsergeant';

command
	.version(pkg.version)
	.option('-r, --repo [user/repository]', 'Define the [comma delimited] repositories to check PRs.')
	.option('-e, --email [email@address]', 'Set the [comma delimited] email address(es) to be notified.', null)
	.option('-f, --replyto [Notifier Title <email@address>]', 'Set the reply to email address.', 'Drill Sergeant Notifier <no-reply@drillsergeant>')
	.option('-l, --label', 'Should drill sergeant label the PR as stale?', false)
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

if (!command.email && !command.label) {
	console.error('Email or label argument must be provided.');
	process.exit(1);
}

repos = command.repo.split(',');

ghClient = new github(process.env.GITHUB_TOKEN);
notifier = new notify();

stalerepos.retrieve(repos, ghClient, command.staletime)
	.then(function(results) {
		if (!results.length) {
			console.log('No stale pull requests to report.');
			return;
		}
		if (command.email) {
			notifier.add(new notifiers.email(command.email, command.replyto));
		}
		if (command.label) {
			notifier.add(new notifiers.github(ghClient));
		}
		notifier.notifyAll(results);
	});
