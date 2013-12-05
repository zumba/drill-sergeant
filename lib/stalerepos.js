var _ = require('underscore'),
	async = require('async');

var stalerepos = module.exports = {
	calcStaleTime: function(prTime) {
		return (new Date().getTime() - new Date(prTime).getTime()) / 1000 / 60 / 60;
	},
	isStale: function(time, staletime) {
		return stalerepos.calcStaleTime(time) >= staletime;
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
					var prs;
					if (repo.prs.length) {
						var filtered;
						prs = [];
						filtered = _.filter(repo.prs, function(pr) {
							return stalerepos.isStale(pr.created_at, staletime);
						});
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
				callback(entries);
			}
		);
	}
};
