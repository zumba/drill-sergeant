var _ = require('underscore');
var async = require('async');

module.exports = (function() {

    var Notifier, notifiers = [];

    Notifier = function() {};

    Notifier.prototype.add = function(notifier) {
        if (!notifier.notify) {
            throw 'Provided notifier must implemnt a notify method.';
        }
        notifiers.push(notifier);
    };

    Notifier.prototype.notifyAll = function(repoData, callback) {
        var notifications = [];
        callback = callback || function() {};

        _.each(notifiers, function(notifier) {
            notifications.push(_.bind(notifier.notify, notifier, repoData));
        });

        async.parallel(notifications, callback);
    };

    return Notifier;

}());
