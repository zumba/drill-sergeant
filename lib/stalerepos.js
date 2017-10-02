const fs = require('fs');
var _ = require('lodash');
const co = require('co');

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

	retrieve(repos, staletime) {
		const separatedRepos = repos.map(repo => {
			const [ owner, name ] = repo.split('/');
			return {
				owner: owner,
				name: name
			};
		});
		return co.call(this, function*() {
			const response = yield this.ghClient.graph(this.queryTemplate({ repos: separatedRepos }));
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
								labels: data.labels.edges.map(entry => entry.node.name),
								reviewCount: data.reviews.totalCount
							};
						})
						.filter(pr => this.isStale(staletime, pr))
				};
			});
		});
	}
};