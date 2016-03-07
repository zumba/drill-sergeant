module.exports = {
	notify: function(repos) {
		repos.forEach(function(repo, i) {
			if (!i) {
				console.log(repo.repo);
			}
			repo.prs.forEach(function(pr) {
				console.log('  %s - %s', pr.title, pr.html_url);
			});
		});
	}
};
