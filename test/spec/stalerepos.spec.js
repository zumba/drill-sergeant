const StaleRepos = require('../../lib/stalerepos');
const fs = require('fs');

describe('Stale Repo Lib', function() {
	it('will calculate the stale time', function() {
		const stalerepos = new StaleRepos()
		var target = new Date();
		target.setHours(target.getHours() - 4);
		expect(Math.round(stalerepos.calcStaleTime(target))).to.equal(4);
	});
	it('will determine if the stale time has exceeded the threshold', function() {
		const stalerepos = new StaleRepos()
		var exceeded = new Date(),
			behind = new Date();
		exceeded.setHours(exceeded.getHours() - 10);
		behind.setHours(behind.getHours() - 4);
		expect(stalerepos.isStale(5, {created_at: exceeded.toISOString()})).to.be.true;
		expect(stalerepos.isStale(5, {created_at: behind.toISOString()})).to.be.false;
	});
	it('will retrieve stale pull requests for all repos', function(done) {
		const githubGraph = {
			graph: function(query) {
				const expected = fs.readFileSync(__dirname + '/../fixture/pullrequestgraphquery.txt').toString();
				query.should.equal(expected);
				// inspect the query here
				return require('../fixture/pullrequestgraph.json');
			}
		}
		stalerepos = new StaleRepos(githubGraph);
		stalerepos.retrieve(['zumba/repository'], 1).should.eventually.deep.equal([
			{
				repo: 'zumba/repository',
				prs: [
					{
						"created_at": "2013-12-04T21:44:54Z",
						"updated_at": "2013-12-04T21:44:54Z",
						"html_url": "https://github.com/zumba/repository/pull/19",
						"number": 19,
						"title": "Some pull request.",
						"user": "cjsaylor",
						"labels": [
							"Code Reviewed",
							"Stale"
						]
					}
				]
			}
		]).notify(done);
	});
});
