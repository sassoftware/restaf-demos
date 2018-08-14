# Serverless functions for scoring with astore

This repository contains information on deploying a scoring application as an AWS serverless function.

## Details on the end points

1. app - Invoke this from your browser. In the app you can enter the caslib and name of your astore. you will then be prompted for values to be scored.

2. score and describe - These end points are used by the app end point. You can also access these from a tool like POSTMAN. Since these two have a POST method you have to specify a payload. The sample payloads are shown in the next step. The **input** object will depend on what your astore expects.

3. The other end points are simply there to see if the service itself is up - these end points do not invoke Viya.

## Sample payload for describe function
```
{ "astore": { "caslib": "public", "name": "paysimsvdd.sasast"} }

```

## Sample payload for score function
```
{ "astore": { "caslib": "public", "name": "paysimsvdd.sasast"} ,
  "input": { 
        "type_n"        : 1,
        "amount"        : 1000000,
        "newbalanceDest": 10000,
        "newbalanceOrig": 500,
        "oldbalanceDest": 1,
        "oldBalanceOrg" : 1,
        "isFraud"       : 0

    }
}




```


    




