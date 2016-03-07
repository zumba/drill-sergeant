var command = require('commander'),
	pkg = require('./package.json'),
	github = require('./lib/github'),
	stalerepos = require('./lib/stalerepos'),
	notifiers = {
		email: require('./lib/notifiers/email'),
		github: require('./lib/notifiers/github'),
		console: require('./lib/notifiers/console')
	},
	notify = require('./lib/notify');

var ghClient, repos, mail;

process.title = 'drillsergeant';

var coerceList = function(input) {
	return input.split(',');
};

command
	.version(pkg.version)
	.option('-r, --repo <user/repository>', 'Define the [comma delimited] repositories to check PRs.', coerceList, [])
	.option('-e, --email [email@address]', 'Set the [comma delimited] email address(es) to be notified.', null)
	.option('-f, --replyto [Notifier Title <email@address>]', 'Set the reply to email address.', 'Drill Sergeant Notifier <no-reply@drillsergeant>')
	.option('-l, --label', 'Should drill sergeant label the PR as stale?', false)
	.option('-s, --staletime [number of hours]', 'Set the PR stale threshold. (default: 24)', 24)
	.parse(process.argv);

if (!process.env.GITHUB_TOKEN) {
	console.error('GITHUB_TOKEN is required.');
	process.exit(1);
}

if (!command.repo.length) {
	console.error('Repo argument must be provided.');
	process.exit(1);
}

ghClient = new github(process.env.GITHUB_TOKEN);
notifier = new notify();

stalerepos.retrieve(command.repo, ghClient, command.staletime)
	.then(function(results) {
		if (!results.length) {
			console.log('No stale pull requests to report.');
			return;
		}
		if (command.email) {
			notifier.add(new notifiers.email(command.email, command.replyto, ghClient));
		}
		if (command.label) {
			notifier.add(new notifiers.github(ghClient));
		}
		if (!command.email && !command.label) {
			notifier.add(notifiers.console);
		}
		notifier.notifyAll(results);
	});
