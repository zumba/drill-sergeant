const fs = require('fs');
const _ = require('lodash');
const { IncomingWebhook } = require('@slack/client');

module.exports = class Slack {
	constructor(webhookURL) {
		const template = fs.readFileSync(__dirname + '/../../templates/slack.md').toString();
		this.compiledTemplate = _.template(template);
		this.hook = new IncomingWebhook(webhookURL);
	}

	async notify(repos) {
		await this.hook.send(this.compiledTemplate({ repos: repos }));
	}
};