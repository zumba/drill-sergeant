const fs = require('fs');
const P = require('bluebird');
const Hipchatter = require('hipchatter');
const co = require('co');
const _ = require('lodash');

module.exports = class Hipchat {
	constructor(apiKey, roomID) {
		const template = fs.readFileSync(__dirname + '/../../templates/hipchat.html').toString();
		this.compiledTemplate = _.template(template);
		this.roomID = roomID;
		this.client = new Hipchatter(apiKey);
		this.client.notify = P.promisify(this.client.notify);
	}

	notify(repos) {
		return co.call(this, function*() {
			return yield this.client.notify(this.roomID, {
				message: this.compiledTemplate({ repos: repos }),
				message_format: 'html',
				notify: true,
				color: 'gray'
			});
		});
	}
};