# Repo Issue Counter

# Question
- Total number of open issues
- Number of open issues that were opened in the last 24 hours
- Number of open issues that were opened more than 24 hours ago but less than 7 days ago
- Number of open issues that were opened more than 7 days ago 

# Solution!

  - I used Github Rest API v3 for getting the required data.
  - Calling API with repo name gives us the total number of open issues.
  - Then a call to /issues with necesary flags gives all the issues but in a page order i.e.  page 1 has 100, page 2 has next 100 and so on.
  - All the calls are async in nature so n parallel calls are started for first set of results. But in case in first call we get n * 100 issues then we recursively start n parallel processes for as long as there are issues.
  - For calculating dates I have used moments.js
  - This code is written Node.js and I've used fatify as web framework.

### Future Work
Github's API v4 is using GraphQL which in some blog posts is claimed to be fater than REST. So if given more time I would have tried to implement GraphQL.
The API itself is very low performing, there isn't much can be done the way we fetch the data, minor tweaks can surely improve the performance a bit, but in my view there won't be any considerable improvement. 

# Important!
To run this you will have to give your Auth token at /api/github.js line 4. Which you can generate from settings/Developer settings/personal acess token.

# How to start
  - Env- Nodejs, npm
  - Clone the repo
  - npm install
  - node index.js
  - open index.html
  - Enter repo URL
  
