const rp = require('request-promise-native');
const co = require('co');

const GithubGraph = class GithubGraph {
	constructor(token, requester) {
		this.token = token;
		this.requester = requester || rp;
	}

	graph(query) {
		return co.call(this, function*() {
			return yield this.requester({
				method: 'POST',
				uri: 'https://api.github.com/graphql',
				body: {
					query: query
				},
				headers: {
					'User-Agent': 'Drill-Sergeant-App',
					Authorization: `bearer ${this.token}`
				},
				json: true
			});
		});
	}
};

module.exports = GithubGraph;