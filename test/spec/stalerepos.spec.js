var stalerepos = require('../../lib/stalerepos'),
	github = require('../../lib/github');

describe('Stale Repo Lib', function() {
	it('will calculate the stale time', function() {
		var target = new Date();
		target.setHours(target.getHours() - 4);
		expect(Math.round(stalerepos.calcStaleTime(target))).toEqual(4);
	});
	it('will determine if the stale time has exceeded the threshold', function() {
		var exceeded = new Date(),
			behind = new Date();
		exceeded.setHours(exceeded.getHours() - 10);
		behind.setHours(behind.getHours() - 4);
		expect(stalerepos.isStale(5, {created_at: exceeded.toISOString()})).toBeTruthy();
		expect(stalerepos.isStale(5, {created_at: behind.toISOString()})).toBeFalsy();
	});
	it('will retrieve stale pull requests for all repos', function() {
		var gc = new github('token');
		var clientMock = {
			authenticate: function() {
				//no op
			},
			pullRequests: {
				getAll: function(options, callback) {
					var fixed = require('../fixture/pullrequests.json');
					var target = new Date();
					target.setHours(target.getHours() - 4);
					fixed.created_at = target.toISOString();
					fixed.updated_at = target.toISOString();
					callback(null, fixed);
				}
			}
		};
		gc.setClient(clientMock);
		stalerepos.retrieve(['zumba/repository'], gc, 1, function(res) {
			expect(res.length).toEqual(1);
			expect(res[0]).toEqual({
				repo: jasmine.any(String),
				prs: jasmine.any(Array)
			});
			expect(res[0].prs[0]).toEqual({
				created_at: jasmine.any(String),
				html_url: jasmine.any(String),
				title: jasmine.any(String),
				number: jasmine.any(Number),
				user: jasmine.any(String),
				updated_at: jasmine.any(String)
			});
		});
	});
});
