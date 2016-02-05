var Github = require('github'),
	_ = require('lodash'),
	P = require('bluebird');

/**
 * @scope Client
 */
var authenticate = function() {
	this.ghClient.authenticate({
		type: 'oauth',
		token: this.token
	});
};

var Client = module.exports = function(token) {
	this.token = token;
	this.ghClient = new Github({
		version: '3.0.0',
		protocol: 'https'
	});
};

Client.prototype.getPullRequests = function(repo, state) {
	var repoInfo = repo.split('/');
	var requestArgs = {
		user: repoInfo[0],
		repo: repoInfo[1],
		state: state
	};
	authenticate.call(this);
	return P.fromCallback(this.ghClient.pullRequests.getAll.bind(this.ghClient, requestArgs));
};

Client.prototype.getLabels = function(repo, prNumber) {
	var repoInfo = repo.split('/');
	var issueArgs = {
		user: repoInfo[0],
		repo: repoInfo[1],
		number: prNumber
	};
	authenticate.call(this);
	return P.fromCallback(this.ghClient.issues.getRepoIssue.bind(this.ghClient, issueArgs)).then(function(issue) {
		return issue.labels.map(function(label) {
			return label.name;
		});
	});
};

var appendLabels = function(user, repo, number, appendLabels) {
	authenticate.call(this);
	return P.fromCallback(this.ghClient.issues.edit.bind(this.ghClient, {
		user: user,
		repo: repo,
		number: number,
		labels: appendLabels || []
	}));
};

Client.prototype.setLabels = function(repo, prNumber, labels) {
	var repoInfo = repo.split('/');
	return this.getLabels(repo, prNumber)
		.then(function(issueLabels) {
			return appendLabels.call(this, repoInfo[0], repoInfo[1], prNumber, _.union(issueLabels, labels));
		}.bind(this));
};

Client.prototype.setClient = function(client) {
	this.ghClient = client;
};
