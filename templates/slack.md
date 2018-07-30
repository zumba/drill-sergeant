*Stale Pull Requests*
<% _.each(repos, function(repo) { %>
<%= repo.repo %>
<% _.each(repo.prs, function(pr) { %>
• <<%= pr.html_url %>|<%= pr.title %>> by <https://github.com/<%= pr.user %>|@<%= pr.user %>> <%= pr.labels.join(', ') %>
<% }); %>
<% }); %>