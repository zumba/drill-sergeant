var _ = require('underscore'),
	fs = require('fs');

module.exports = (function() {
	var Email = function(emailAddresses) {
		var template = fs.readFileSync(__dirname + '/../templates/email.html').toString();
		this.emailAddresses = emailAddresses;
		this.compiledTemplate = _.template(template);
		this.client = require('nodemailer').mail;
	};

	Email.prototype.setClient = function(client) {
		this.client = client;
	}

	Email.prototype.notify = function(repos) {
		this.client({
			from: 'Drill Sergeant Notifier <no-reply@drillsergeant>',
			to: this.emailAddresses,
			subject: 'Drill Sergeant Stale Pull Request Report',
			html: this.compiledTemplate({ repos: repos })
		});
	};

	return Email;

}());
