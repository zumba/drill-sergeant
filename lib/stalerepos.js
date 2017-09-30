const fs = require('fs');
var _ = require('lodash');

module.exports = class StaleRepos {
	constructor(ghClient) {
		this.ghClient = ghClient;
		this.queryTemplate = _.template(fs.readFileSync(__dirname + '/../templates/repositoryQuery').toString());
	}

	calcStaleTime(prTime) {
		return (new Date().getTime() - new Date(prTime).getTime()) / 1000 / 60 / 60;
	}

	isStale(staletime, pr) {
		return this.calcStaleTime(pr.created_at) >= staletime;
	}

	async retrieve(repos, staletime) {
		const separatedRepos = repos.map(repo => {
			const [ owner, name ] = repo.split('/');
			return {
				owner: owner,
				name: name
			};
		});
		const response = await this.ghClient.graph(this.queryTemplate({ repos: separatedRepos }));
		return _.map(response.data, (prs, repo) => {
			const [owner, ...name] = repo.split('_');
			return {
				repo: `${owner}/${name.join()}`,
				prs: prs.pullRequests.edges
					.map(pr => {
						const data = pr.node;
						return {
							user: data.author.login,
							created_at: data.createdAt,
							html_url: data.url,
							title: data.title,
							number: data.number,
							updated_at: data.updatedAt,
							labels: data.labels.edges.map(entry => entry.node.name)
						};
					})
					.filter(pr => this.isStale(staletime, pr))
			};
		});
	}
};