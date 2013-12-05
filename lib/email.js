var mail = require('nodemailer').mail,
	_ = require('underscore'),
	fs = require('fs');

module.exports = (function() {
	var Email = function(emailAddresses) {
		var template = fs.readFileSync(__dirname + '/../templates/email.html').toString();
		this.emailAddresses = emailAddresses;
		this.compiledTemplate = _.template(template);
	};

	Email.prototype.notify = function(repos) {
		mail({
			from: 'Drill Sergeant Notifier <no-reply@drillsergeant>',
			to: this.emailAddresses,
			subject: 'Drill Sergeant Stale Pull Request Report',
			html: this.compiledTemplate({ repos: repos })
		});
	};

	return Email;

}());
