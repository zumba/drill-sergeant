var fs = require('fs');
var _ = require('lodash');
var P = require('bluebird');

var Email = module.exports = function(emailAddresses, replyTo) {
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
	var escapePrTitle = function(pr) {
		pr.title = _.escape(pr.title);
		return pr;
	};
	var mapTitles = function(repo) {
		repo.prs = repo.prs.map(escapePrTitle);
		return repo;
	};
	var sendEmail = function() {
		return this.client({
			from: this.replyTo,
			to: this.emailAddresses,
			subject: 'Drill Sergeant Stale Pull Request Report (' + Email.getSubjectDate() + ')',
			html: this.compiledTemplate({ repos: repos })
		});
	}.bind(this);
	return P.map(repos, mapTitles).then(sendEmail);
};
