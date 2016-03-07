var _ = require('lodash');
module.exports = {
	includeLabels: function(labels, repo) {
		if (!labels.length) {
			return repo;
		}
		repo.prs = repo.prs.filter(function(pr) {
			return pr.labels.length > _.difference(pr.labels, labels).length
		});
		return repo;
	},
	excludeLabels: function(labels, repo) {
		if (!labels.length) {
			return repo;
		}
		repo.prs = repo.prs.filter(function(pr) {
			return pr.labels.length === _.difference(pr.labels, labels).length
		});
		return repo;
	}
};
