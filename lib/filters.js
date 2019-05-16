var _ = require('lodash');
module.exports = {
	includeLabels: function(labels, repo) {
		if (!labels.length) {
			return repo;
		}
		repo.prs = repo.prs.filter(function(pr) {
			return pr.labels.length > _.difference(pr.labels, labels).length;
		});
		return repo.prs.length > 0;
	},
	excludeLabels: function(labels, repo) {
		if (!labels.length) {
			return repo;
		}
		repo.prs = repo.prs.filter(function(pr) {
			return pr.labels.length === _.difference(pr.labels, labels).length;
		});
		return repo.prs.length > 0;
	},
	includeReviewed: function(count, repo) {
		if (!count) {
			return repo;
		}
		repo.prs = repo.prs.filter(pr => pr.reviewCount >= count);
		return repo.prs.length > 0;
	},
	excludeReviewed: function(count, repo) {
		if (!count) {
			return repo;
		}
		repo.prs = repo.prs.filter(pr => pr.reviewCount < count);
		return repo.prs.length > 0;
	},
	excludeDrafts: function(repo) {
		repo.prs = repo.prs.filter(pr => !pr.isDraft);
		return repo.prs.length > 0;
	}
};
