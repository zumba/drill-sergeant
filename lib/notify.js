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

	async notifyAll(repoData) {
		let promises = this.notifiers.map(notifier => notifier.notify(repoData));
		await Promise.all(promises);
	}
};
