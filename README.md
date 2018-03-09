# restaf-demos

A collection of examples demonstrating then use of restaf in nodejs.
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

