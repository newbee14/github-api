# Repo Issue Counter
- Total number of open issues
- Number of open issues that were opened in the last 24 hours
- Number of open issues that were opened more than 24 hours ago but less than 7 days ago
- Number of open issues that were opened more than 7 days ago 

# Solution!

  - I used Github Rest API v3 for get the required data.
  - Basic info to the API with repo name gives us the total number of open issues.
  - Then a call to /issues with necesary flags gives all the issues but in a page order i.e.  page 1 has 100, page 2 has next 100 and so on.
  - All the calls are i async in nature so I started 4 parallel processes for first 4 pages. If there are are no more issues the pages return undefined. But in case in first call we get 400 issues then we recursively start 2 parallel processes for as long as there are issues.
  - For calculating dates I have used moments.js
  - This code is written Node.js and I've used fatify as the middleware.

### Future Work
Github's API v4 is using GraphQL which in some blog posts is claimed to be fater than REST. So if given more time I would have tried to implement GraphQL.
The API itself is very low performing there isn't much can be done the way we pull the data minor tweaks can surely improve the performance a bit but in my view there won't be any considerable improvement. 

#Important
To run this you will have to give your Auth token at /api/github.js line 4. Which you can generate from settings/Developer settings/personal acess token.
