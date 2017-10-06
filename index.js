const command = require('commander');
const co = require('co');
const pkg = require('./package.json');
const GithubClient = require('./lib/github');
const GithubGraph = require('./lib/githubGraph');
const StaleRepos = require('./lib/stalerepos');
const notifiers = {
	email: require('./lib/notifiers/email'),
	github: require('./lib/notifiers/github'),
	hipchat: require('./lib/notifiers/hipchat'),
	console: require('./lib/notifiers/console')
};
const notify = require('./lib/notify');
const filters = require('./lib/filters');

process.title = 'drillsergeant';

const coerceList = function(input) {
	return input.split(',');
};

command
	.version(pkg.version)
	.option('-r, --repo <user/repository>', 'Define the [comma delimited] repositories to check PRs.', coerceList, [])
	.option('-e, --email [email@address]', 'Set the [comma delimited] email address(es) to be notified.', null)
	.option('-f, --replyto [Notifier Title <email@address>]', 'Set the reply to email address.', 'Drill Sergeant Notifier <no-reply@drillsergeant>')
	.option('-l, --label', 'Should drill sergeant label the PR as stale?', false)
	.option('-s, --staletime [number of hours]', 'Set the PR stale threshold. (default: 24)', 24)
	.option('--include-labels [labels]', 'Define a [comma delimited] group of labels of which a PR must have at least one.', coerceList, [])
	.option('--exclude-labels [labels]', 'Define a [comma delimited] group of labels of which a PR must NOT contain.', coerceList, [])
	.option('--include-reviewed [count]', 'Filter PRs with at least [count] approved reviews.',  0)
	.option('--exclude-reviewed [count]', 'Filter PRs without at least [count] approved reviews.',  0)
	.option('--hipchat-apikey [api key]', 'Hipchat API integration key. If included, hipchat will attempt to be notified.')
	.option('--hipchat-room [room name]', 'Hipchat room ID or name.')
	.parse(process.argv);

if (!process.env.GITHUB_TOKEN) {
	console.error('GITHUB_TOKEN is required.');
	process.exit(1);
}

if (!command.repo.length) {
	console.error('Repo argument must be provided.');
	process.exit(1);
}

function main() {
	co(function*() {
		const githubGraph = new GithubGraph(process.env.GITHUB_TOKEN);
		const githubClient = new GithubClient(process.env.GITHUB_TOKEN);
		const notifier = new notify();
		const stalerepos = new StaleRepos(githubGraph);
		try {
			const allPRs = yield stalerepos.retrieve(command.repo, command.staletime);
			const results = allPRs
				.filter(filters.includeLabels.bind(null, command.includeLabels))
				.filter(filters.excludeLabels.bind(null, command.excludeLabels))
				.filter(repo => command.includeReviewed === 0 || filters.includeReviewed(command.includeReviewed, repo))
				.filter(repo => command.excludeReviewed === 0 || filters.excludeReviewed(command.excludeReviewed, repo));
			if (!results.length) {
				console.log('No stale pull requests to report.');
				return;
			}
			if (command.email) {
				notifier.add(new notifiers.email(command.email, command.replyto));
			}
			if (command.label) {
				notifier.add(new notifiers.github(githubClient));
			}
			if (command.hipchatApikey) {
				notifier.add(new notifiers.hipchat(command.hipchatApikey, command.hipchatRoom));
			}
			if (!command.email && !command.label && !command.hipchatApikey) {
				notifier.add(notifiers.console);
			}
			notifier.notifyAll(results);
		} catch (e) {
			console.error(e);
			process.exit(1);
		}
	});
}

main();

