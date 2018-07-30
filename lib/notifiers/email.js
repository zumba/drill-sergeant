var fs = require('fs');
var _ = require('lodash');

module.exports = class Email {
	constructor(emailAddresses, replyTo, subjectTemplate = 'Drill Sergeant Stale Pull Request Report (<%= date %>)') {
		this.emailAddresses = emailAddresses;
		this.replyTo = replyTo;
		this.compiledTemplate = _.template(fs.readFileSync(__dirname + '/../../templates/email.html').toString());
		this.subjectTemplate = subjectTemplate;
		this.client = require('nodemailer').createTransport({
			sendmail: true
		});
	}

	getSubjectDate() {
		return new Date().toLocaleDateString();
	}

	setClient(client) {
		this.client = client;
	}

	async notify(repos) {
		const escapePrTitle = pr => Object.assign(pr, {
			title: _.escape(pr.title)
		});
		const mappedRepos = repos.map(repo => Object.assign(repo, {
			prs: repo.prs.map(escapePrTitle)
		}));
		const subject = _.template(this.subjectTemplate)({
			date: this.getSubjectDate()
		});
		await this.client.sendMail({
			from: this.replyTo,
			to: this.emailAddresses,
			subject: subject,
			html: this.compiledTemplate({
				repos: mappedRepos
			})
		});
	}
};
