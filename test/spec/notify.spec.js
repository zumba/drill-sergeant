var notify = require('../../lib/notify');

describe('Notifier', function() {
    var subject;
    beforeEach(function() {
        subject = new notify();
    });
    it('should ensure attached notifier is called', function() {
        var notifier = {
            notify: sinon.spy()
        };
        subject.add(notifier);
        subject.notifyAll('somedata');
        notifier.notify.should.have.been.calledWith('somedata');
    });
    it('should throw an exception if invalid notifier attached.', function() {
        var invalid = {};
        expect(subject.add.bind(subject, invalid)).to.throw(Error);
    });
    it('should not throw an exception when adding valid notifier.', function() {
        var notifier = {
            notify: function() {}
        };
        expect(subject.add.bind(subject, notifier)).not.to.throw(Error);
    });
});
