describe('Notify Lib', function() {
    var notify = require('../../lib/notify');
    var notifier, lib, callback;
    beforeEach(function() {
        notifier = {
            notify: function(repos) {}
        };
        lib = new notify();
        lib.add(notifier);

        spyOn(notifier, 'notify');

        callback = function() {}
        lib.notifyAll('somedata', callback);
    });
    it('should ensure attached notifier is called', function() {
        expect(notifier.notify).toHaveBeenCalled();
    });
    it('should have been called with provided repo data', function() {
        expect(notifier.notify.mostRecentCall.args[0]).toEqual('somedata');
        expect(notifier.notify.mostRecentCall.args[1] instanceof Function).toBeTruthy()
    });
});
