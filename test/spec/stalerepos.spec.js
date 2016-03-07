var stalerepos = require('../../lib/stalerepos'),
	github = require('../../lib/github');

describe('Stale Repo Lib', function() {
	it('will calculate the stale time', function() {
		var target = new Date();
		target.setHours(target.getHours() - 4);
		expect(Math.round(stalerepos.calcStaleTime(target))).to.equal(4);
	});
	it('will determine if the stale time has exceeded the threshold', function() {
		var exceeded = new Date(),
			behind = new Date();
		exceeded.setHours(exceeded.getHours() - 10);
		behind.setHours(behind.getHours() - 4);
		expect(stalerepos.isStale(5, {created_at: exceeded.toISOString()})).to.be.true;
		expect(stalerepos.isStale(5, {created_at: behind.toISOString()})).to.be.false;
	});
	it('will retrieve stale pull requests for all repos', function(done) {
		var gc = new github('token');
		var clientMock = {
			authenticate: function() {},
			pullRequests: {
				getAll: function(options, callback) {
					var fixed = require('../fixture/pullrequests.json');
					var target = new Date();
					target.setHours(target.getHours() - 4);
					fixed.created_at = target.toISOString();
					fixed.updated_at = target.toISOString();
					callback(null, fixed);
				}
			},
			issues: {
				getRepoIssue: function(options, callback) {
					callback(null, {
						labels: []
					});
				}
			}
		};
		gc.setClient(clientMock);
		stalerepos.retrieve(['zumba/repository'], gc, 1).should.eventually.deep.equal([
			{
				repo: 'zumba/repository',
				prs: [
					{
						"created_at": "2013-12-04T21:44:54Z",
						"html_url": "https://github.com/zumba/repository/pull/19",
						"number": 19,
						"title": "Some pull request.",
						"user": "cjsaylor",
						"labels": []
					}
				]
			}
		]).notify(done);
	});
});
