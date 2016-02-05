var P = require('bluebird');

var Notifier = module.exports = function() {
    this.notifiers = [];
};

Notifier.prototype.add = function(notifier) {
    if (!notifier.notify) {
        throw new Error('Provided notifier must implemnt a notify method.');
    }
    this.notifiers.push(notifier);
};

Notifier.prototype.notifyAll = function(repoData) {
    var notifications = [];

    this.notifiers.forEach(function(notifier) {
        notifier.notify(repoData);
    });
};
