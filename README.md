# Examples of integrating gpt prompts into SAS Viya apps

This repository contains examples of integrating gpt into application targeting SAS Viya.
The purpose is to demonstrate that integrating the power of gpt into one's own application is not rocket-science = the credit goes to the simplicity and elegance of the gpt api.

Since the key audience for this repository is SAS customers the examples are focused on integrating gpt into applications for SAS Viya.

## Data Points

1. gpt-4 version is used in this repo.
   - if you are using a different version, search the repo for gpt-4 and change it to your version
2. It is the user's reponsibility to get the api key for openai.
   - The samples assume that the key is available as enviroment variable APPENV_USERKEY
3. Most examples make use of SAS REST API to access SAS Viya. The applications use @sassoftware/restaf, @sassoftware/restaflib and @sassoftware/restafedit to make these calls. See <https://sassoftware.github.io/restaf/> for more information.
4. The source code in this repository is provided under Apache-2.0 licensing model.

## Installing the examples

- git clone https://github.com/sassoftware/restaf-demos opt-samples -b opt-samples
- cd to opt-samples
- npm install
- Define the environment variables described below

### Environment Variables

- VIYA_SERVER - Set the value of this env variable to the url for your Viya Server
- SASTOKEN - For nodejs applications this should have the location of the authentication information created by executing the following command
  - sas-viya auth login|loginCode
- CLIENTID, CLIENTSECRET - For web applications set this to the authorization_code clientid and clientsecret. The redirect should be set to <https://localhost:8080>
- APPENV_USERKEY - Set to the api key from openai

## Getting started - Basic example

This example demonstrates setting up access to gpt and defining a function called basic. This function's sole purpose is to reformat user provided keywords as html, array or javascript object.
The code is in ./packages/basic/index.js

### Usage

```sh
npm start <some prompt as a quoted string>
```

Some sample prompt and results:

### what is SAS Viya

```txt
SAS Viya is a cloud-based, in-memory analytics engine from SAS Institute, an American multinational developer of analytics software. SAS Viya provides quick, accurate results and reveals valuable insights from large amounts of data. It's capable of machine learning, text analytics, forecasting, optimization, and statistics. It can be used through a variety of programming languages including Python, R, Java, and Lua, or through its visual interface.
```

### keywords

```txt
Sure, can you provide me with the keywords you want to process?
```

### keywords a,b,c as array

```js
[ 'a', 'b', 'c' ]
```

### keywords a,b,c as html

```txt
<ul><li>a</li><li>b</li><li>c</li></ul>
```
