const fetch = require('node-fetch');
const moment = require('moment');

const TOKEN = 'a25a0f185463d850849052d2a20a742c07d45099'; //github token for Authentication
const defaultFetchOptions = {
	method: 'get',
	headers: {
		Authorization: `token ${TOKEN}`
	}
};
//fetch call to github apis
const getFetchRequest = async (url, method = 'get', options = defaultFetchOptions) => {
	return fetch(url, { method: method, ...options });
};
/* 
	async function called my main function and returns promise
	one first run it creates 4 async requests and still if all the issues have not been fetched it
	recursively creates 2 requests as loong as all the issues have not been fetched
*/
const getIssues = async (issueURL, since, page = 1, lastPage = 4) => {
	const max = lastPage - page + 1;
	//waits for all the results of the apis calls made have been fetched
	const responses = await Promise.all(
		[...Array(max)].map((x, i) => {
			return getFetchRequest(`${issueURL}&page=${page + i}&since=${new Date(since).toISOString()}`);
		})
	);
	//resolves the promise and concats all the results
	const data = await Promise.all(responses.map((res) => res.json()));
	//console.log(data);
	let finalData = [].concat.apply([], data);
	//if all the issues have not been fetched then we make recursive calls to fetch all data
	if (finalData.length === max * 100) {
		finalData = finalData.concat(await getIssues(issueURL, since, lastPage + 1, lastPage + 3));
	}

  return new Promise((resolve) => {
    resolve(finalData);
  });
};

async function githubRoutes(fastify) {
	
		fastify.get('/', async (request, reply) => {
			let repo = request.query.url || '';
			//check is query param is there
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
			const repoURL = `https://api.github.com/repos/${user}/${repoName}`;
			const issueURL = `https://api.github.com/repos/${user}/${repoName}/issues?state=open&per_page=100`;
			const apiCalls = [];
			// Parallel API calls
			try {
				apiCalls.push(fetch(repoURL, defaultFetchOptions).then((response) => response.json()), getIssues(issueURL, moment().subtract(1, 'day')), getIssues(issueURL, moment().subtract(7, 'day')));
				const data = await Promise.all(apiCalls);
				if (data[0].message && data[0].message === 'Not Found') {
       				return {
         				error: true,
         				message: 'Invalid Repo Address'
       				}		 
				}
				const openIssueCount = data[0].open_issues_count || 0;
				const lastDayOpenIssueCount = openIssueCount === 0 ? 0 : data[1].length;
				const lastSevenDaysOpenIssueCount = openIssueCount === 0 ? 0 : data[2].length - lastDayOpenIssueCount;
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
