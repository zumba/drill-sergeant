var _ = require('lodash');
var async = require('async');

module.exports = (function() {

    var GithubNotifier;

    GithubNotifier = function(client) {
        this.client = client;
    };

    GithubNotifier.prototype.notify = function(repos) {
        var cb, queue = [];
        cb = function(err, result) {
            if (err) {
                console.error(err.message);
            }
        };
        _.forEach(repos, _.bind(function(repo) {
            _.forEach(repo.prs, _.bind(function(pr) {
                queue.push(_.bind(this.client.setLabels, this.client, repo.repo, pr.number, ['Stale']));
            }, this));
        }, this));

        if (queue.length) {
            async.parallel(queue, cb);
        }
    };

    return GithubNotifier;

}());
