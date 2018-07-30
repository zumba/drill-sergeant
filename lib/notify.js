module.exports = class Notifier {
	constructor() {
		this.notifiers = [];
	}

	add(notifier) {
		if (!notifier.notify) {
			throw new Error('Provided notifier must implemnt a notify method.');
		}
		this.notifiers.push(notifier);
	}

	length() {
		return this.notifiers.length;
	}

	notifyAll(repoData) {
		this.notifiers.forEach(function (notifier) {
			notifier.notify(repoData);
		});
	}
};
