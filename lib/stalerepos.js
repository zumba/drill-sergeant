var _ = require('lodash'),
	async = require('async');

var stalerepos = module.exports = {
	calcStaleTime: function(prTime) {
		return (new Date().getTime() - new Date(prTime).getTime()) / 1000 / 60 / 60;
	},
	isStale: function(staletime, pr) {
		return stalerepos.calcStaleTime(pr.created_at) >= staletime;
	},
	retrieve: function(repos, ghClient, staletime, callback) {
		var entries = [];
		async.map(
			repos, 
			function(repo, cb) {
				ghClient.getPullRequests(repo, 'open', function(err, res) {
					var result = {};
					if (err) {
						cb(err);
					}
					delete res.meta;
					result.repo = repo;
					result.prs = res;
					cb(null, result);
				});
			},
			function(err, res) {
				if (err) {
					console.error(err);
					process.exit(1);
				}
				_.each(res, function(repo) {
					var prs, picked;
					if (repo.prs.length) {
						var filtered;
						prs = [];
						filtered = _.filter(repo.prs, _.bind(stalerepos.isStale, null, staletime));
						if (filtered.length) {
							_.each(filtered, function(pr) {
								picked = _.pick(pr, ['created_at', 'html_url', 'title', 'number', 'updated_at']);
								picked.user = pr.user.login;
								prs.push(picked);
							});
							entries.push({
								repo: repo.repo,
								prs: prs
							});
						}
					}
				});
				callback(entries);
			}
		);
	}
};
