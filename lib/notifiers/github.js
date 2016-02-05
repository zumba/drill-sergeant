var _ = require('lodash');
var P = require('bluebird');

var GithubNotifier = module.exports = function(client) {
    this.client = client;
};

GithubNotifier.prototype.notify = function(repos) {
    var queue = [];
    var client = this.client;
    repos.forEach(function(repo) {
        repo.prs.forEach(function(pr) {
            queue.push(client.setLabels(repo.repo, pr.number, ['Stale']));
        });
    });
    return P.all(queue);
};
