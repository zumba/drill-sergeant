var _ = require('underscore'),
	async = require('async'),
	command = require('commander'),
	pkg = require('./package.json'),
	github = require('./lib/github');

var ghClient, repos, entries = [], now = new Date().getTime();

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

async.map(
	repos, 
	function(repo, callback) {
		ghClient.getPullRequests(repo, 'open', function(err, res) {
			var result = {};
			if (err) {
				callback(err);
			}
			delete res.meta;
			result.repo = repo;
			result.prs = res;
			callback(null, result);
		});
	},
	function(err, res) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		_.each(res, function(repo) {
			var prs;
			if (repo.prs.length) {
				var filtered;
				prs = [];
				filtered = _.filter(repo.prs, function(pr) {
					return (now - new Date(pr.created_at).getTime()) / 1000 / 60 / 60 >= command.staletime;
				})
				if (filtered.length) {
					_.each(filtered, function(pr) {
						prs.push(_.pick(pr, ['created_at', 'html_url', 'title']));
					});
					entries.push({
						repo: repo.repo,
						prs: prs
					});
				}
			}
		});
		console.log(entries);
	}
);
