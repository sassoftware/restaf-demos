# restaf-demos

A collection of examples demonstrating then use of restaf in nodejs and in serverless functions
The demos cover typical SAS software usages - running datastep, running cas actions,
accessing VA reports etc...

Please review the source code to see how restaf is used to achieve
the desired goal with minimal coding.


## Install
```
example:
git clone https://github.com/sassoftware/restaf-demos.git
cd restaf-demos
npm install
```

## Configure the app
### Server setup
To run this application you need to do the following:

1. Ask your system administrator to enable CORS using the SAS Environment Manager.

2. Ask your system administrator to give you a clientid and clientSecret appropriate
for password flow.

### Creating env file
Copy the demos.env file to some location.
Edit demos.env file and follow the instructions in the file.
Key values to set:

1. VIYA_SERVER
2. CLIENTID
3. CLIENTSECRET



## Running the application
```
node examples/<name of example> <location of env file>

Example:
If the modified env file is at ../demos.env then to run logon.js example enter

node examples/logon ../demos/env
```

## List of examples

- addServices - initialization of specific Viya Services

- appdata -  adding and retrieving app specific information from restaf

- casds -  executing datastep in CAS

- casEcho - executing echo action

- casFetch - fetching data from CAS

- casSentiment - sentiment analysis in CAS

- casSessions - creating CAS sessions

- casTables - list fileinfo for all tables in all caslibs

- casUpload - upload a csv file and operate on it

- casUploadAstore - upload a astore to cas

- casUploadImages - upload images to file service

- codeTable - create and execute a codeTable (useful in scoring)

- computeds - execute a compute service

- logon  - logon to a Viay server

- paginate - paginate thru the file service and list the file names

- reportElement - prints the named elements in a VA report

- reportImage - generate an image(svg) for a report

- reportList - list the names of all the reports

- request - access an external url

- submit - run a job in the background.


- reportList - list all the reports

## Serverless Examples

The serverless subdirectory has examples of using restaf to build AWS serverless functions.

- sls-scoreAstore - scoring using an astore - astore must be stored on the Viya Server

- sls-sentiment  - get sentiment score for a given text

- sls-image - display an image for a SAS VA report


### Configuring the serverless.yml

In this version the serverless.yml references the awsenv.yml file to get information that is usually common between all 
the serverless functions ( vpc, subnets etc...). 


## Poor Man's version of debugging of Serverless functions

IDE's like VSCode have capability to debug serverless functions. But not all users use this IDE.
So I built a very simple way to invoke the API endpoints in nodejs debugger. 

### Configuration

In the env file add the following three options (see reataf.env for an example)

```

SLS=<serverless function name in examples dir>    <-- ex: sls-scoreAstore
SLSPATH=path    <-- the specific sls path ex: score
SLSPAYLOAD=<payload file path> <-- a json file with the payload(if POST or PUT)ex: score.json

```

### Execution

To run with nodejs inspect issue the following command

```
npm run debugAPI <envfile with the information discussed above>
```

Then follow standard nodejs debugging process

To run without debug turned on issue the following command

```
npm run runAPI <envfile with the information discussed above>


