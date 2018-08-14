# Serverless functions for sentiment analysis

This repository contains information on deploying a sentiment analysis application as an AWS serverless function.
  
## Installation

1. Clone this directory from this repo.

2. Control your deployment by editing the serverless.yml file

    - Edit the envionment section and replace with your values. I am using password flow for clientid and clientsecret.
        ```
           VIYA_SERVER: http://1.1.1.1
            CLIENTID: <clientid>
            CLIENTSECRET: <clientid>
            USER: valid-user
            PASSWORD: valid-password
        ```
    - Edit the other standard serverless parameters(vpc, region etc...)

    

## Deployment

**sls deploy** will deploy the serverless function


## usage

This package generates two serverless functions:

- app - the web app to enter text for sentiment analysis

- sentiment - this function invokes SAS Viya to do sentiment analysis

 Invoke the app function using the url generated during the deploy action.
    




