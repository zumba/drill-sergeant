var _ = require('underscore'),
	fs = require('fs');

module.exports = (function() {
	var Email = function(emailAddresses, replyTo) {
		var template = fs.readFileSync(__dirname + '/../../templates/email.html').toString();
		this.emailAddresses = emailAddresses;
		this.replyTo = replyTo;
		this.compiledTemplate = _.template(template);
		this.client = require('nodemailer').mail;
	};

	Email.getSubjectDate = function() {
		return new Date().toLocaleDateString();
	};

	Email.prototype.setClient = function(client) {
		this.client = client;
	};

	Email.prototype.notify = function(repos) {
		this.client({
			from: this.replyTo,
			to: this.emailAddresses,
			subject: 'Drill Sergeant Stale Pull Request Report (' + Email.getSubjectDate() + ')',
			html: this.compiledTemplate({ repos: repos })
		});
	};

	return Email;

}());
