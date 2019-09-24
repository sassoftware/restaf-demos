
# Version 0.5.0

- Added AWS serverless functions for scroing and sentiment analysis
- cleaned up the examples
- Added an inventory of the examples in the README.md file

# Version 0.5.1

- Added sls-image serverless example

# Version 0.6.2

## Organization of repository

- Moved all nodejs samples into the examples/samples sub-directory. Makes it easier to view the repository

## Serverless functions

- Moved all the common parts of serverless.yml into awsenv.yml in the root directory.
- Added index.js to the root of each serverless functions to export the entries to serverless.yml. Motivation was the next item.
- Added runAPI.js to help with debugging the serverless functions end points(see README file for more information)

- Fixed issues created by moving the examples directory

## Version 0.6.3

- Added CORS support to sls-scoreAstore example
