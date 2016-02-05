var _ = require('lodash');
var P = require('bluebird');

var stalerepos = module.exports = {
	calcStaleTime: function(prTime) {
		return (new Date().getTime() - new Date(prTime).getTime()) / 1000 / 60 / 60;
	},
	isStale: function(staletime, pr) {
		return stalerepos.calcStaleTime(pr.created_at) >= staletime;
	},
	retrieve: function(repos, ghClient, staletime, callback) {
		var entries = [];
		var prQueue = [];
		var mapProperties = ['created_at', 'html_url', 'title', 'number', 'update_at'];
		repos.forEach(function(repo) {
			prQueue.push(ghClient.getPullRequests.bind(ghClient, repo, 'open'));
		});
		return P.map(repos, function(repo) {
			return ghClient.getPullRequests(repo, 'open').then(function(prs) {
				return {
					repo: repo,
					prs: prs
				};
			});
		}).then(function(results) {
			return results.map(function(repo) {
				return {
					repo: repo.repo,
					prs: repo.prs
						.filter(stalerepos.isStale.bind(null, staletime))
						.map(function(pr) {
							var user = pr.user.login;
							pr = _.pick(pr, mapProperties);
							pr.user = user;
							return pr;
						})
				};
			});
		});
	}
};
