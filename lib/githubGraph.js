const GithubGraph = class GithubGraph {
	constructor(token, requester) {
		this.token = token;
		this.requester = requester || require('request-promise-native');
	}

	async graph(query) {
		return await this.requester({
			method: 'POST',
			uri: 'https://api.github.com/graphql',
			body: {
				query: query
			},
			headers: {
				'User-Agent': 'Drill-Sergeant-App',
				Authorization: `bearer ${this.token}`,
				// Allows for the "preview" of draft PR properties
				// @see https://developer.github.com/v4/previews/#draft-pull-requests-preview
				'Accept': 'application/vnd.github.shadow-cat-preview+json',
			},
			json: true
		});
	}
};

module.exports = GithubGraph;