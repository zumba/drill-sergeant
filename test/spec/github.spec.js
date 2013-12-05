describe('Github Lib', function() {
	var github = require('../../lib/github');
	it('will get pull requests for a repo', function() {
		var ghClient;
		var clientMock = {
			_testAuthCalled: 0,
			authenticate: function() {
				//no op
				clientMock._testAuthCalled++;
			},
			pullRequests: {
				getAll: function(options, callback) {
					expect(options).toEqual({
						user: 'zumba',
						repo: 'repository',
						state: 'open'
					});
					expect(clientMock._testAuthCalled).toEqual(1);
				}
			}
		};
		ghClient = new github('token');
		ghClient.setClient(clientMock);
		ghClient.getPullRequests('zumba/repository', 'open', function() {});
	});
});
