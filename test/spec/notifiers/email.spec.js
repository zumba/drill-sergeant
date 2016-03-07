var fs = require('fs');
var email = require('../../../lib/notifiers/email');
var github = require('../../../lib/github');
var _ = require('lodash');

describe('Email lib', function() {
	it('will email a notification with stale repos', function() {
		var mail, clientMock, template, repos;

		mail = new email('test@test.com', 'test-from@test.com');
		template = _.template(fs.readFileSync(__dirname + '/../../../templates/email.html').toString());
		repos = [
			{
				repo: 'zumba/repository',
				prs: [{
					created_at: new Date().toISOString(),
					html_url: 'https://github/zumba/repository/pull/19',
					title: 'Some <b>awesome</b> pull request',
					user: 'someuser',
					number: '19',
					labels: ['sometag']
				}]
			}
		];
		clientMock = function(options) {
			expect(options).to.deep.equal({
				from: 'test-from@test.com',
				to: 'test@test.com',
				subject: 'Drill Sergeant Stale Pull Request Report (2013/12/01)',
				html: template({repos: repos})
			});
			expect(_.trim(options.html)).to.deep.equal(_.trim(fs.readFileSync(__dirname + '/email_output.html').toString()));
		};
		mail.setClient(clientMock);
		// Mock the date on the subject
		email.getSubjectDate = function() {
			return '2013/12/01';
		}
		mail.notify(repos);
	});
});
