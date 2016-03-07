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
		var applyLabels = function(repo, pr) {
			return this.getLabels(repo, pr.number)
				.then(function(labels) {
					pr.labels = labels;
					return pr;
				});
		};
		var mapRepoLabels = function(repo) {
			return P.map(repo.prs, applyLabels.bind(this, repo.repo))
				.then(function(prs) {
					return {
						repo: repo.repo,
						prs: prs
					};
				});
		}.bind(ghClient);
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
		}).map(mapRepoLabels);
	}
};
