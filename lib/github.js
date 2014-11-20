var Github = require('github'),
	_ = require('underscore');

module.exports = (function() {
	var Client, authenticate;

	Client = function(token) {
		this.token = token;
		this.ghClient = new Github({
			version: '3.0.0',
			protocol: 'https'
		});
	};

	Client.prototype.getPullRequests = function(repo, state, callback) {
		var repoInfo;
		authenticate(this);

		repoInfo = repo.split('/');
		this.ghClient.pullRequests.getAll({
			user: repoInfo[0],
			repo: repoInfo[1],
			state: state
		}, function(err, res) {
			if (err) {
				return callback(err);
			}
			callback(null, res);
		});
	};

	Client.prototype.setLabels = function(repo, prNumber, labels, callback) {
		var repoInfo, updateLabels;
		authenticate(this);

		repoInfo = repo.split('/');

		updateLabels = function(user, repo, number, appendLabels) {
			this.ghClient.issues.edit({
				user: user,
				repo: repo,
				number: number,
				labels: appendLabels || []
			}, function (err, res) {
				if (err) {
					return callback(err);
				}
				callback(null, res);
			});
		}.bind(this, repoInfo[0], repoInfo[1], prNumber);

		this.ghClient.issues.getRepoIssue({
			user: repoInfo[0],
			repo: repoInfo[1],
			number: prNumber
		}, function(err, res) {
			var mapper = function(label) {
				return label.name;
			};
			if (err) {
				return callback(err);
			}
			updateLabels(_.union(res.labels.map(mapper), labels));
		});
	};

	Client.prototype.setClient = function(client) {
		this.ghClient = client;
	};

	authenticate = function(client) {
		client.ghClient.authenticate({
			type: 'oauth',
			token: client.token
		});
	};

	return Client;

}());
