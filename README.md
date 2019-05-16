# Repo Issue Counter

# Question
- Total number of open issues
- Number of open issues that were opened in the last 24 hours
- Number of open issues that were opened more than 24 hours ago but less than 7 days ago
- Number of open issues that were opened more than 7 days ago 

# Solution!

  - I used Github Rest API v3 for getting the required data.
  - Calling API with repo name gives us the total number of open issues with pull requests.
  - Calling Search API with repo name and type PR gives us the total number Pull Request, from which we can get total open issues.
  - Calling search API to get to get open issues for given time intervals.
  - For calculating dates I have used moments.js.
  - This code is written Node.js and I've used fatify as web framework.

### Future Work
Github's API v4 is using GraphQL which in some blog posts is claimed to be fater than REST. So if given more time I would have tried to implement GraphQL.

# Important!
To run this you will have to give your Auth token at /api/github.js line 4. Which you can generate from settings/Developer settings/personal acess token.

# How to start
  - Env- Nodejs, npm
  - Clone the repo
  - npm install
  - node index.js
  - open index.html
  - Enter repo URL
  
