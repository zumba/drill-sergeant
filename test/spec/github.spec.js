var github = require('../../lib/github');

describe('Github lib', function() {
	it('will get pull requests for a repo', function(done) {
		var ghClient = new github('token');
		var authenticateSpy = sinon.spy();
		ghClient.setClient({
			authenticate: authenticateSpy,
			pullRequests: {
				getAll: function(options, callback) {
					expect(options).to.deep.equal({
						user: 'zumba',
						repo: 'repository',
						state: 'open'
					});
					callback(null, 'somedata');
				}
			}
		});
		ghClient.getPullRequests('zumba/repository', 'open').should.eventually.be.equal('somedata').notify(done);
		authenticateSpy.should.have.been.calledWith({
			type: 'oauth',
			token: 'token'
		});
	});
});
