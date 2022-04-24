# restaf-demos

A collection of examples demonstrating then use of restaf in nodejs
The demos cover typical SAS software usages - running datastep, running cas actions,
accessing VA reports etc...

Please review the source code to see how restaf is used to achieve
the desired goal with minimal coding.


## Install
```
example:
git clone https://github.com/sassoftware/restaf-demos -b restaf-demos
cd restaf-demos
npm install
```

## Configure the app
### Server setup
To run this application you need to do the following:

Ask your system administrator to give you a clientid and clientSecret appropriate
for password flow.

> A note on password flow:  With the advent of TFA you should start transistioning away from using userid+password to run the examples in this repository. Instead use a saved token to execute these programs.


### How to get token

You can use the standard sas-cli.

```cmd
sas-viya auth login
```

Or you can use the newer version which uses authorization_code flow to get the token

```cmd
sas-viya auth loginCode
```

Save the token in some secure place (the .sas directory is a good place)

### Edit the .env file

The .env file is the way to specify configurations. 

```env
VIYA_SERVER= <your viya server url : ex: http://myviya.sas.com>
# Preferred way
# TOKENFILE=<path to a persisted viya authentication token>
# ex: TOKENFILE=../../token

## Alternate setup: Will work until the use of password flow is phased out.

# CLIENTID=sas.ec
# CLIENTSECRET=
# USER=xxx
# PASSWORD=ppp

# if Viya server still has the unsigned certificate and your protocol is https
NODE_TLS_REJECT_UNAUTHORIZED=0

```


## Running the application

```md
npm test testname
```

### Debugging your code.

```md
npm debug testname
```

Then use your favorite nodejs debugger. I use the chrome://inspect on Google chrome.

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

- computeds - execute a compute service

- computedsEasy - accessing compute service using restaflib

- logon  - logon to a Viya server

- paginate - paginate thru the file service and list the file names

- reportElement - prints the named elements in a VA report

- reportImage - generate an image(svg) for a report

- reportList - list the names of all the reports

- request - access an external url

- submit - run a job in the background.

- submitAction - run a cas job in the background

- submitcasl - similar to submitAction for runcasl


- reportList - list all the reports

## Serverless Examples

These have been removed since they have not been kept up with changes to AWS serverless functions.
