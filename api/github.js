const fetch = require('node-fetch');
const moment = require('moment');

const TOKEN = ''; //github token for Authentication
const defaultFetchOptions = {
	method: 'get',
	headers: {
		Authorization: `token ${TOKEN}`
	}
};
//fetch call to github apis
const getFetchRequest = async (url, method = 'get', options = defaultFetchOptions) => {
	console.log(url);
	return fetch(url, { method: method, ...options }).then((response) => response.json());
};
//function to fetch issues
const getIssues = async (issueURL, since) => {
	const responses = await getFetchRequest(`${issueURL}+created:%3E=${moment(since).format('YYYY-MM-DDTHH:mm:ss')}%2B05:30`);
	return responses;
};

async function githubRoutes(fastify) {
	
		fastify.get('/', async (request, reply) => {
			let repo = request.query.url || '';
			if (!repo) {
				return {
					error: true,
					message: 'Invalid URL Query Param'
				};
			}
			// extract user and repo name
			const patt = /((git@|http(s)?:\/\/)?([\w\.@]+)(\/|:))([\w,\-,\_]+)\/([\w,\-,\_]+)(.git){0,1}((\/){0,1})/g;
			var match = patt.exec(repo);
			
			const user = match[6];
			const repoName = match[7];
			//check if url is valid
			if (!repoName || !user || (match[4] !== 'github.com' && match[4] !== 'www.github.com')) {
				return {
					error: true,
					message: 'Invalid REPO URL'
				};
			}
			//prepare API URL
			const prURL = `https://api.github.com/search/issues?q=+is:pr+repo:${user}/${repoName}+is:open`;
			const repoURL = `https://api.github.com/repos/${user}/${repoName}`;
	
			//const issueURL = `https://api.github.com/repos/${user}/${repoName}/issues?state=open&per_page=100`;
			const issueURL= `https://api.github.com/search/issues?q=+is:issue+repo:${user}/${repoName}+is:open`;
			const apiCalls = [];
			// Parallel API calls
			console.log("repoURL"+"      "+repoURL);
			
			try {
				apiCalls.push(
					getFetchRequest(repoURL, defaultFetchOptions), 
					getIssues(issueURL, moment().subtract(1, 'day')), 
					getIssues(issueURL, moment().subtract(7, 'day')),
					getFetchRequest(prURL, defaultFetchOptions), 
					
					);
				
				const data = await Promise.all(apiCalls);
				//console.log(data);
				
				if (data[0].message && data[0].message === 'Not Found') {
       				return {
         				error: true,
         				message: 'Invalid Repo Address'
       				}		 
				}
				
				const openIssueCount =data[0].open_issues_count - data[3].total_count || 0;
				const lastDayOpenIssueCount = openIssueCount === 0 ? 0 : data[1].total_count;
				const lastSevenDaysOpenIssueCount = openIssueCount === 0 ? 0 : data[2].total_count - lastDayOpenIssueCount;
				const moreThanSevenDays = openIssueCount === 0 ? 0 : openIssueCount - lastSevenDaysOpenIssueCount - lastDayOpenIssueCount;
				return { repoOwner: user, repoUrl: repo, repoName, openIssueCount, lastDayOpenIssueCount, lastSevenDaysOpenIssueCount, moreThanSevenDays };
			} catch (e) {
				return {
					error: true,
					message: e.message,
					stack: e.stack
				};
			}
		});
}

module.exports = githubRoutes;
