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
	}

	authenticate = function(client) {
		client.ghClient.authenticate({
			type: 'oauth',
			token: client.token // 'd26ea5e215f4793c6893c34c3319a4fc867f6c05'
		});
	};

	return Client;

}());
