var fs = require('fs');
var _ = require('lodash');
var P = require('bluebird');

var Email = module.exports = function(emailAddresses, replyTo, ghClient) {
	var template = fs.readFileSync(__dirname + '/../../templates/email.html').toString();
	this.emailAddresses = emailAddresses;
	this.replyTo = replyTo;
	this.compiledTemplate = _.template(template);
	this.client = require('nodemailer').mail;
	this.ghClient = ghClient;
};

Email.getSubjectDate = function() {
	return new Date().toLocaleDateString();
};

Email.prototype.setClient = function(client) {
	this.client = client;
};

var applyLabels = function(repo, pr) {
	return this.getLabels(repo, pr.number)
		.then(function(labels) {
			pr.labels = labels;
			return pr;
		});
};

Email.prototype.notify = function(repos) {
	var escapePrTitle = function(pr) {
		pr.title = _.escape(pr.title);
		return pr;
	};
	var mapRepoLabels = function(repo) {
		return P.map(repo.prs, applyLabels.bind(this.ghClient, repo.repo)).map(escapePrTitle);
	}.bind(this);
	var sendEmail = function() {
		return this.client({
			from: this.replyTo,
			to: this.emailAddresses,
			subject: 'Drill Sergeant Stale Pull Request Report (' + Email.getSubjectDate() + ')',
			html: this.compiledTemplate({ repos: repos })
		});
	}.bind(this);
	return P.map(repos, mapRepoLabels).then(sendEmail);
};
